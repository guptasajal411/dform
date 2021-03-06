const express = require('express');
const app = express();
const cors = require('cors');
const pageController = require("../controllers/pageController");
const authController = require("../controllers/authController");
const formController = require("../controllers/formController");
const responsesController = require("../controllers/responsesController");
const middleware = require("../middleware/middleware");

app.use(cors());
app.use(express.json());

app
    .route("/")
    .get(pageController.getHome);

app
    .route("/api/register")
    .post(authController.postRegister);

app
    .route("/api/login")
    .post(authController.postLogin);

app
    .route("/api/dashboard")
    .get(middleware.verifyMiddleware, pageController.getDashboard);

app
    .route("/api/new")
    .get(middleware.verifyMiddleware, pageController.getNew)
    .post(middleware.verifyMiddleware, pageController.postNew);

app
    .route("/api/form/:formSlug")
    .get(formController.getForm)
    .post(formController.postForm);

app
    .route("/api/responses/:formSlug")
    .get(middleware.verifyMiddleware, responsesController.getResponses);

module.exports = app;