const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const csrf = require("csurf");
const { hash, compare } = require("./bcrypt.js");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: `Cookiemonster on the Hunt`,
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
    if (!first || !last || !password) {
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
