const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const globalErrorHandler = require("./app/middleware/globalErrorHandler");
const routes = require("./app/routes");
const webhookRoutes = require("./app/module/payment/webhook.routes");
const NotFoundHandler = require("./error/NotFoundHandler");
const corsOptions = require("./helper/corsOptions");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors(corsOptions));
app.use("/stripe/webhook", webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/", routes);

app.get("/", async (req, res) => {
  res.json("Welcome to Nardo");
});

app.use(globalErrorHandler);
app.use(NotFoundHandler.handle);

module.exports = app;
