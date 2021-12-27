const express = require('express');
const app = express();
const cors = require('cors');
const pageController = require("../controllers/pageController");

app.use(cors());
app.use(express.json());

app
    .route("/api/register")
    .post(pageController.postRegister);

module.exports = app;