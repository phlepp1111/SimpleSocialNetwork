const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const csrf = require("csurf");
const { hash, compare } = require("./bcrypt.js");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./SES");
const s3 = require("./S3");
const uidSafe = require("uid-safe");
const multer = require("multer");
const secrets = require("../secrets");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: secrets.COOKIE,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.urlencoded({ extended: false }));

app.use(csrf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.json());

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    console.log("POST REGISTRATION");
    let { first, last, email, password } = req.body;
    if (!first || !last || !email || !password) {
        res.json({ success: false });
    } else {
        hash(password)
            .then((password_hash) => {
                console.log("PW HASH:", password_hash);
                db.registerUser(first, last, email, password_hash).then(
                    ({ rows }) => {
                        console.log("db.registerUser: ", rows[0]);
                        req.session.userId = rows[0].id;
                        res.json({
                            success: true,
                        });
                    }
                );
            })
            .catch((error) => {
                console.log("HASH Error: ", error);
                res.json({
                    success: false,
                });
            });
    }
});

app.post("/login", (req, res) => {
    console.log("login POST route");
    const { email, password } = req.body;
    let userId;
    let password_hash;
    db.getPassword(email)
        .then(({ rows }) => {
            password_hash = rows[0].password_hash;
            userId = rows[0].id;
            return compare(password, password_hash);
        })
        .then((match) => {
            if (match) {
                console.log("MATCH! user id is: ", userId);
                req.session.userId = userId;
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        })
        .catch((error) => {
            console.log("Password Server Error: ", error);
            res.json({ success: false });
        });
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.sendStatus(200);
});

app.post("/reset1", (req, res) => {
    const { email } = req.body;
    db.getPassword(email)
        .then(({ rows }) => {
            if (rows[0]) {
                const resetCode = cryptoRandomString({ length: 6 });
                db.addResetCode(email, resetCode).then(() => {
                    ses.sendResetEmail(email, resetCode);
                    res.json({ success: true });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((error) => {
            console.log("Error in reset stage one", error);
        });
});

app.post("/reset2", (req, res) => {
    const { resetCode, newPassword, email } = req.body;
    console.log("reset req.body:", req.body);
    db.getResetCode(email).then(({ rows }) => {
        console.log("rows from db: ", rows);
        console.log("resetCode from db: ", rows[0].resetcode);
        if (rows[0].resetcode === resetCode) {
            hash(newPassword).then((password_hash) => {
                db.updatePassword(password_hash, email).then(() => {
                    res.json({ success: true });
                });
            });
        } else {
            res.json({ error: true });
        }
    });
});

app.get("/profile-info", (req, res) => {
    console.log("userId: ", req.session.userId);
    db.getUser(req.session.userId).then(({ rows }) => {
        console.log("rows in get user:", rows);
        res.json({
            success: true,
            first: rows[0].first,
            last: rows[0].last,
            bio: rows[0].bio,
            imageUrl: rows[0].imageurl,
        });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    if (req.file) {
        db.updateImage(
            req.session.userId,
            "https://s3.amazonaws.com/image-board-bucket/" + filename
        )
            .then(({ rows }) => {
                console.log("New profile img added - details:", rows);
                res.json({
                    imageUrl: rows[0].imageurl,
                    success: true,
                });
            })
            .catch((error) => {
                console.log("err in addImages", error);
                res.json({ success: false });
            });
    }
});

app.post("/bioSAVE", (req, res) => {
    const { bioDraft } = req.body;
    db.saveBio(bioDraft, req.session.userId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.log("error saving bio: ", error);
            res.json({ success: false });
        });
});

app.post("/getOtherProfile", (req, res) => {
    if (req.body.id == req.session.userId) {
        res.json({ success: false });
    } else {
        db.getUser(req.body.id)
            .then(({ rows }) => {
                if (rows[0]) {
                    console.log("rows getOtherUsers", rows);
                    res.json(rows[0]);
                } else {
                    res.json({ success: false });
                }
            })
            .catch((error) => console.log("error in getOtherUser", error));
    }
});

app.post("/users/most-recent", (req, res) => {
    db.getMostRecent()
        .then(({ rows }) => {
            console.log("Most recent ROWS:", rows);
            res.json({ success: true, users: rows });
        })
        .catch((error) => {
            console.log("error grabbing recent people", error);
            res.json({ success: false });
        });
});

app.post("/users/:input", (req, res) => {
    const input = req.params.input;
    db.searchPeople(input)
        .then((result) => res.json(result.rows))
        .catch((error) => console.log("search error", error));
    // console.log(req.params);
});

app.get("/users/getFriendshipStatus", (req, res) => {
    console.log("req.params FriendshipStatus: ", req.params);
    db.getFriendshipStatus(req.session.userId, req.params.id)
        .then((result) => {
            console.log("Result Friendshipstatus: ", result);
        })
        .catch((error) =>
            console.log("Error getting friendship status: ", error)
        );
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
