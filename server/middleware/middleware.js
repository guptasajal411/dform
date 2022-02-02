const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.verifyMiddleware = (req, res, next) => {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.TOKEN_SIGN_KEY, (err, decoded) => {
        if (decoded) {
            User.findOne({ email: decoded.email }, (err, foundUser) => {
                if (foundUser.username === req.headers["username"]) {
                    next();
                } else {
                    res.status(501).send({ status: 'error', message: "JWT is invalid. Please log in again. Redirecting..." });
                }
            });
        } else if (err) {
            res.status(501).send({ status: 'error', message: "An error occurred while verifying JWT. Please log in again. Redirecting..." });
        } else {
            res.status(501).send({ status: "error", message: "JWT is invalid. Please log in again. Redirecting..." });
        }
    })
}