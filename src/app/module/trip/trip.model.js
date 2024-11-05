const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const tripSchema = new Schema(
  {
    car: {
      type: ObjectId,
      ref: "Car",
      required: true,
    },
    host: {
      type: ObjectId,
      ref: "Host",
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    tripStartDate: {
      type: String,
      required: true,
    },
    tripStartTime: {
      type: String,
      required: true,
    },
    tripStartDateTime: {
      type: Date,
      required: true,
    },
    tripEndDate: {
      type: String,
      required: true,
    },
    tripEndTime: {
      type: String,
      required: true,
    },
    tripEndDateTime: {
      type: Date,
      required: true,
    },
    isPickupAtLocation: {
      type: Boolean,
    },
    pickupLocation: {
      type: String,
    },
    returnLocation: {
      type: String,
      required: true,
    },
    tripPrice: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
    },
    maxTripDistance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;
