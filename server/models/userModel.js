const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    username: {type: 'string', required: "Username is required."},
    email: {type: 'string', required: "Email is required."},
    password: {type: 'string', required: "Password is required."},
    forms: [{
        formTitle: String,
        formDescription: String,
        formViews: Number,
        formSubmissions: Number,
        formSlug: String,
        formQuestions: []
    }]
});

const User = new mongoose.model("User", userSchema);

module.exports = User;