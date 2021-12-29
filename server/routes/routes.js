const express = require('express');
const app = express();
const cors = require('cors');
const pageController = require("../controllers/pageController");
const authController = require("../controllers/authController");

app.use(cors());
app.use(express.json());

app
    .route("/api/register")
    .post(authController.postRegister);

app
    .route("/api/login")
    .post(authController.postLogin);

app
    .route("/api/dashboard")
    .post(pageController.postDashboard);

module.exports = app;