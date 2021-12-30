const express = require('express');
const app = express();
const cors = require('cors');
const pageController = require("../controllers/pageController");
const authController = require("../controllers/authController");
const formController = require("../controllers/formController");

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
    .get(pageController.getDashboard);

app
    .route("/api/new")
    .get(pageController.getNew)
    .post(pageController.postNew)

app
    .route("/api/form/:formSlug")
    .get(formController.getForm)

module.exports = app;