const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
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
    role: {
      type: String,
      enum: ["USER", "HOST"],
      default: "USER",
      required: true,
    },
    profile_image: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    licenseExpiryDate: {
      type: String, // yyyy-mm-dd
    },
    licenseDateOfBirth: {
      type: String, // yyyy-mm-dd
    },

    // for host
    rating: {
      type: Number,
      default: 0,
    },
    carCount: {
      type: Number,
    },
    cars: [
      {
        type: ObjectId,
        ref: "Car",
      },
    ],
    trip: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);

module.exports = User;
