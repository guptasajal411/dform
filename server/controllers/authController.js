const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postRegister = (req, res) => {
    if (req.body.email && req.body.password && req.body.username) {
        // request body contains all required fields
        User.find({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        }).exec(async function (err, foundUser) {
            if (foundUser.length == 0) {
                // user is unique
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, async function (err, hash) {
                        if (err) {
                            res.status(501).send({ status: "error", message: err });
                        }
                        // Store hash in your password DB.
                        const newUser = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                        });
                        await newUser.save();
                        res.status(200).send({ status: "ok", "message": "Registered succesfully, redirecting..." });
                    });
                });
            } else {
                // user already exists
                res.status(501).send({ status: "error", message: "Username/email already exists." });
            }
        });
    } else {
        // request body doesnt contain all required fields
        console.log(req.body)
        res.status(501).send({ status: "error", message: "Please enter all fields before submitting." });
    }
}

exports.postLogin = (req, res) => {
    if (req.body.email && req.body.password) {
        // request body contains all required fields
        User.findOne({ email: req.body.email }, (err, foundUser) => {
            if (foundUser) {
                // compare password
                bcrypt.compare(req.body.password, foundUser.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ email: req.body.email }, process.env.TOKEN_SIGN_KEY, { expiresIn: "1h" });
                        res.status(200).send({ status: "ok", message: "Login successful, redirecting...", token, username: foundUser.username });
                    } else if (err) {
                        res.status(501).send({ status: "error", message: "An error occurred." });
                    } else {
                        res.status(200).send({ status: "error", message: "Wrong password. Please try again." });
                    }
                });
            } else {
                // email not found
                res.status(200).send({ status: "error", message: "User not found. Try registering." });
            }
        });
    } else {
        // request body doesnt contain all required fields
        res.status(501).send({ status: "error", message: "Please enter all fields before submitting." });
    }
}