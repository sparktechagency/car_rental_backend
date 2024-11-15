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

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    console.log("webhook hit");

    let event;
    try {
      console.log("try hit");
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        "whsec_41c71273d0be8064482c15a2abf32a7e71fdfe3a26822a56670657af08b96ec8"
      );
      // console.log(event.data.object);
    } catch (err) {
      console.log("catch hit");
      // console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    let checkoutSessionCompleted;
    let paymentIntentSucceeded;

    switch (event.type) {
      case "checkout.session.completed":
        checkoutSessionCompleted = event.data.object;
        console.log("checkoutSessionCompleted");
        // fn
        break;
      case "payment_intent.succeeded":
        paymentIntentSucceeded = event.data.object;
        console.log("paymentIntentSucceeded");
        // fn
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type`);
      // console.log(`Unhandled event type ${event.type}`);
    }

    // const event = await PaymentService.webhookManager(request);
    // console.log(event);
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
