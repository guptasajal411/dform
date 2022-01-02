const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.getResponses = (req, res) => {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.TOKEN_SIGN_KEY, (err, decoded) => {
        if (decoded) {
            User.findOne({ forms: { $elemMatch: { formSlug: req.params.formSlug } } }, async (err, foundForm) => {
                if (err) {
                    res.status(404).send({ status: "error", message: req.params.formSlug + " form not found." });
                } else {
                    if (foundForm) {
                        // form found
                        res.status(200).send({
                            status: "ok",
                            form: foundForm.forms.filter(obj => obj.formSlug === req.params.formSlug)[0],
                            username: foundForm.username
                        });
                    } else {
                        // no form found
                        res.status(404).send({ status: "error", message: req.params.formSlug + " form not found." });
                    }
                }
            });
        } else if (err) {
            res.status(501).send({ status: 'error', message: "An error occurred while verifying JWT. Please log in again." });
        } else {
            res.status(501).send({ status: "error", message: "JWT is invalid. Please log in again." });
        }
    });
}