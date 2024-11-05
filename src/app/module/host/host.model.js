const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const hostSchema = new Schema(
  {
    authId: {
      type: ObjectId,
      required: true,
      ref: "Auth",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
    },
    phone_number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    licenseExpiryDate: {
      type: String, // yyyy-mm-dd
      required: true,
    },
    licenseDateOfBirth: {
      type: String, // yyyy-mm-dd
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Host = model("Host", hostSchema);

module.exports = Host;
