const express = require('express');
const app = express();
const pageController = require("../controllers/pageController");

app
    .route("/")
    .get(pageController.getHomepage);

module.exports = app;