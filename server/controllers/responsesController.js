const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.getResponses = (req, res) => {
    User.findOne({ forms: { $elemMatch: { formSlug: req.params.formSlug } } }, async (err, foundForm) => {
        if (err) {
            res.status(404).send({ status: "error", message: req.params.formSlug + " form not found." });
        } else {
            if (foundForm && foundForm.username === req.headers["username"]) {
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
}