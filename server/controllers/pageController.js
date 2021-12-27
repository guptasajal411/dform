const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.postRegister = (req, res) => {
    // console.log(req.body.username + " " + req.body.email)
    if (req.body.firstName && req.body.lastName && req.body.email && req.body.password && req.body.username){
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
                                if (err){
                                    res.status(501).send({ status: "error", message: err });
                                }
                                // Store hash in your password DB.
                                const newUser = new User({
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    username: req.body.username,
                                    email: req.body.email,
                                    password: req.body.password,
                                });
                                await newUser.save();
                                res.status(200).send({ status: "ok", "message": "Registered succesfully, redirecting..." });
                            });
                        });
            } else {
                // user already exists
                res.status(501).send({ status: "error", message: "Username/email already exists, please try again." });
            }
        });
    } else {
        res.status(501).send({ status: "error", message: "Please enter all fields before submitting." });
    }
}