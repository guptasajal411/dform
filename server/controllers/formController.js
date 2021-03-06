const User = require("../models/userModel");

exports.getForm = (req, res, next) => {
    User.findOne({ forms: { $elemMatch: { formSlug: req.params.formSlug } } }, async (err, foundForm) => {
        if (err) {
            res.status(404).send({ status: "error", message: req.params.formSlug + " form not found." });
        } else {
            if (foundForm) {
                // form found
                foundForm.forms.filter(obj => obj.formSlug === req.params.formSlug)[0].formQuestions.map(v => delete v.answers)
                res.status(200).send({
                    status: "ok",
                    form: foundForm.forms.filter(obj => obj.formSlug === req.params.formSlug)[0]
                });
                foundForm.forms.filter(obj => obj.formSlug === req.params.formSlug)[0].formViews++;
                await foundForm.save();
            } else {
                // no form found
                res.status(404).send({ status: "error", message: req.params.formSlug + " form not found." });
            }
        }
    });
}

exports.postForm = (req, res, next) => {
    User.findOne({ forms: { $elemMatch: { formSlug: req.params.formSlug } } }, async (err, foundForm) => {
        if (err) {
            res.status(404).send({ status: "error", message: req.params.formSlug + " form not found." });
        } else {
            if (foundForm) {
                // form found
                foundForm.forms.filter(obj => obj.formSlug === req.params.formSlug)[0].formQuestions.map((question, questionIndex) => {
                    if (question.type === "text"){
                        const payload = req.body[questionIndex].answer[0]
                        if(req.body[questionIndex].answer[0]){
                            if (question.answers) {
                                question.answers.push(payload);
                            } else {
                                question.answers = [];
                                question.answers.push(payload);
                            }
                        } else {
                            res.status(400).send({ status: 'error', message: "Invalid request! Please try again." });
                        }
                    } else {
                        if (question.options.length === req.body[questionIndex].answer.length){
                            if (question.answers){
                                question.answers.push(req.body[questionIndex].answer);
                            } else {
                                question.answers = [];
                                question.answers.push(req.body[questionIndex].answer)
                            }
                        } else {
                            res.status(400).send({ status: 'error', message: "Invalid request! Please try again." });
                        }
                    }
                });
                foundForm.markModified("forms");
                await foundForm.save();
                res.status(200).send({ status: 'ok', message: "Your response was submitted!" });
            } else {
                // no form found
                res.status(404).send({ status: "error", message: req.params.formSlug + " form not found." });
            }
        }
    });
}