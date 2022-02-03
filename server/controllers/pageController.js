const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.getHome = (req, res) => {
    res.status(200).send({ status: "ok", message: "server is up and running" });
}

exports.getDashboard = (req, res) => {
    User.findOne({ username: req.headers["username"] }, (err, foundUser) => {
        if (foundUser) {
            res.status(200).send({
                status: 'ok',
                message: "Dashboard data returned.",
                username: foundUser.username,
                dashboardData: foundUser.forms.reverse()
            });
        } else {
            res.status(501).send({ status: 'error', message: "User not found. Please log in again. Redirecting..." });
        }
    });
}

exports.getNew = (req, res) => {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.TOKEN_SIGN_KEY, (err, decoded) => {
        if (decoded) {
            User.findOne({ email: decoded.email }, (err, foundUser) => {
                if (foundUser) {
                    res.status(200).send({
                        status: 'ok',
                        message: "JWT is valid.",
                        email: foundUser.email,
                        username: foundUser.username
                    });
                } else {
                    res.status(501).send({ status: 'error', message: "JWT is invalid. Please log in again." });
                }
            });
        } else if (err) {
            res.status(501).send({ status: 'error', message: "An error occurred while verifying JWT. Please log in again." });
        } else {
            res.status(501).send({ status: "error", message: "JWT is invalid. Please log in again." });
        }
    });
}

exports.postNew = (req, res) => {
    function createSlug(length) {
        var result = "";
        var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.TOKEN_SIGN_KEY, (err, decoded) => {
        if (decoded) {
            User.findOne({ email: decoded.email }, async (err, foundUser) => {
                if (foundUser) {
                    const formSlug = createSlug(3) + "-" + createSlug(4) + "-" + createSlug(3)
                    foundUser.forms.push({
                        formAuthorUsername: foundUser.username,
                        formTitle: req.body.formTitle,
                        formDescription: req.body.formDescription,
                        formQuestions: req.body.formQuestions,
                        formSlug: formSlug,
                        formViews: 0
                    });
                    await foundUser.save();
                    res.status(200).send({ status: 'ok', message: "Form created! Redirecting you to your dashboard..." });
                } else {
                    res.status(501).send({ status: 'error', message: "JWT is invalid. Please log in again." });
                }
            });
        } else if (err) {
            res.status(501).send({ status: 'error', message: "An error occurred while verifying JWT. Please log in again." });
        } else {
            res.status(501).send({ status: "error", message: "JWT is invalid. Please log in again." });
        }
    });
}

