const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const tripSchema = new Schema(
  {
    car: {
      type: ObjectId,
      ref: "Car",
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    host: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    tripStartDate: {
      type: String, // MM/DD/YYYY
      required: true,
    },
    tripStartTime: {
      type: String, // HH:MM AM/PM
      required: true,
    },
    tripStartDateTime: {
      type: Date,
      required: true,
    },
    tripEndDate: {
      type: String, // MM/DD/YYYY
      required: true,
    },
    tripEndTime: {
      type: String, // HH:MM AM/PM
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
    maxTripDistance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "canceled", "ongoing", "completed"],
      default: "requested",
    },
  },
  { timestamps: true }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;
