const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.postVerify = async (req, res) => {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.TOKEN_SIGN_KEY, (err, decoded) => {
        if(decoded){
            User.findOne({ email: decoded.email }, (err, foundUser) => {
                if (foundUser){
                    res.status(200).send({ status: 'ok', message: "JWT is valid." });
                } else {
                    res.status(501).send({ status: 'error', message: "JWT is invalid. Please sign in again." });
                }
            });
        } else if (err){
            res.status(501).send({ status: 'error', message: "An error occurred while verifying JWT. Please sign in again." });
        } else {
            res.status(501).send({ status: "error", message: "JWT is invalid. Please sign in again." });
        }
    });
}