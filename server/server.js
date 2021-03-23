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
//socket.io-boilerplate:
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

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

// app.use(
//     cookieSession({
//         secret: secrets.COOKIE,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );
const cookieSessionMiddleware = cookieSession({
    secret: secrets.COOKIE,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
    // res.sendStatus(200);
    res.redirect("/");
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
    // console.log("userId: ", req.session.userId);
    db.getUser(req.session.userId).then(({ rows }) => {
        // console.log("rows in get user:", rows);
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
                    //console.log("rows getOtherUsers", rows);
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
            // console.log("Most recent ROWS:", rows);
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

app.post("/friends/:id", (req, res) => {
    // console.log("req.params FriendshipStatus: ", req.params);
    const sender_id = req.session.userId;
    const recipient_id = req.params.id;
    db.getFriendshipStatus(sender_id, recipient_id)
        .then(({ rows }) => {
            // console.log("Result ROWS Friendshipstatus: ", rows);
            res.json({
                rows: rows[0],
                loggedInUser: req.session.userId,
            });
        })
        .catch((error) =>
            console.log("Error getting friendship status: ", error)
        );
});

app.post("/addFriend", (req, res) => {
    console.log("adding a friend");
    // console.log(req.body);
    const { friendlyAction, otherUser } = req.body;
    const sender_id = req.session.userId;
    const recipient_id = otherUser;
    if (friendlyAction === "ADD FRIEND") {
        db.addFriend(sender_id, recipient_id)
            .then(({ rows }) => {
                // console.log("Result friend request", rows);
                res.json({ rows: rows[0], loggedInUser: req.session.userId });
            })
            .catch((error) =>
                console.log("error adding friend to db, ", error)
            );
    } else if (
        friendlyAction === "UNFRIEND" ||
        friendlyAction === "CANCEL REQUEST"
    ) {
        db.deleteFriend(sender_id, recipient_id)
            .then(({ rows }) => {
                // console.log("rows from deleteFriend", rows);
                res.json({ rows: rows[0], loggedInUser: req.session.userId });
            })
            .catch((error) => console.log("error in db.deletefriend", error));
    } else {
        db.acceptRequest(sender_id, recipient_id)
            .then(({ rows }) => {
                // console.log("rows after accepting friend request", rows);
                res.json({ rows: rows[0], loggedInUser: req.session.userId });
            })
            .catch((error) =>
                console.log("error in acceptFriend-db-req", error)
            );
    }
});

app.get("/get-friends", (req, res) => {
    // console.log("user logged in", req.session.userId);
    db.getFriendConnections(req.session.userId)
        .then(({ rows }) => {
            console.log("getting all connections", rows);
            res.json(rows);
        })
        .catch((error) => {
            console.log("err in get all connections", error);
            res.json({ success: false });
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
// let onlineUsers = {};
io.on("connection", (socket) => {
    console.log(`socket with id: ${socket.id} has connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    // onlineUsers[socket.id] = userId;

    const userId = socket.request.session.userId;
    console.log("user ID in sockets:", userId);
    db.getChat()
        .then(({ rows }) => {
            console.log("result from getChat:", rows);
            socket.emit("chatMessages", rows.reverse());
        })
        .catch((error) => console.log("error getting chat messages: ", error));
    // socket.emit("userConnected", [1, 2, 3]);

    socket.on("my amazing chat message", (msg) => {
        console.log("msg from chat", msg);
        db.addChat(msg, userId)
            .then(({ rows }) => {
                const created_at = rows[0].created_at;
                db.getUser(userId)
                    .then(({ rows }) => {
                        console.log(
                            "getting user-info after chat message",
                            rows
                        );
                        io.sockets.emit("chatMessage", {
                            userId: userId,
                            message: msg,
                            fist_name: rows[0].first,
                            last_name: rows[0].last,
                            imageUrl: rows[0].imageUrl,
                            created_at: created_at,
                        });
                    })
                    .catch((error) =>
                        console.log(
                            "error getting user info after chat msg",
                            error
                        )
                    );
            })
            .catch((error) => console.log("error adding chat to db", error));
        io.sockets.emit("sending back to client", msg);
    });
    socket.on("disconnect", () => {
        console.log(`socket with id: ${socket.id} has disconnected`);
        // delete onlineUsers[socket.id];
    });
});
