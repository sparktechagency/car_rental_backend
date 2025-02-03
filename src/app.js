const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const globalErrorHandler = require("./app/middleware/globalErrorHandler");
const routes = require("./app/routes");
const webhookRoutes = require("./app/module/payment/webhook.routes");
const NotFoundHandler = require("./error/NotFoundHandler");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  cors({
    origin: [
      "http://192.168.12.90:3000",
      "http://192.168.12.90:3001",
      "http://192.168.12.90:3002",
      "http://192.168.12.90:3003",
      "http://192.168.12.90:3004",
      "http://192.168.12.90:3005",
      "http://192.168.12.97:3002",
      "http://10.0.60.43:3000",
      "http://10.0.60.43:3001",
      "http://10.0.60.43:3002",
      "http://10.0.60.43:3003",
      "http://10.0.60.43:3004",
      "http://10.0.60.43:3005",
      "http://localhost:3000",
      "http://10.0.60.44:3002",
      "http://localhost:3001",
      "http://10.0.60.44:3003",
      "http://209.97.134.184:8002",
    ],
    credentials: true,
  })
);
app.use("/stripe/webhook", webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/", routes);

app.get("/", async (req, res) => {
  res.json("Welcome to Car Rental");
});

app.use(globalErrorHandler);
app.use(NotFoundHandler.handle);

module.exports = app;
