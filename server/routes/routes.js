const express = require('express');
const app = express();
const cors = require('cors');
const verifyController = require("../controllers/verifyController");
const pageController = require("../controllers/authController");

app.use(cors());
app.use(express.json());

app
    .route("/api/register")
    .post(pageController.postRegister);

app
    .route("/api/login")
    .post(pageController.postLogin);

app
    .route("/api/verify")
    .post(verifyController.postVerify);

module.exports = app;