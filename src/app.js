const express = require("express");
const path = require("path");
const cors = require("cors");
const globalErrorHandler = require("./app/middleware/globalErrorHandler");
const routes = require("./app/routes");
const NotFoundHandler = require("./error/NotFoundHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// =================
const { PaymentService } = require("./app/module/payment/payment.service");
const config = require("./config");
const stripe = require("stripe")(config.stripe.stripe_secret_key);

const app = express();

app.use(
  cors({
    origin: [],
    credentials: true,
  })
);

// ===============

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const webhookManager = await PaymentService.webhookManager(req);
//     console.log(webhookManager);
//   }
// );

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;
    try {
      console.log("hit try");
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        "whsec_41c71273d0be8064482c15a2abf32a7e71fdfe3a26822a56670657af08b96ec8"
      );
      console.log(event.data.object);
    } catch (err) {
      console.log("hit catch");
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    let checkoutSessionCompleted;
    let paymentIntentSucceeded;
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        checkoutSessionCompleted = event.data.object;
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case "payment_intent.succeeded":
        paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// ===============

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", routes);

app.get("/", async (req, res) => {
  res.json("Welcome to Car Rental");
});

app.use(globalErrorHandler);
app.use(NotFoundHandler.handle);

module.exports = app;
