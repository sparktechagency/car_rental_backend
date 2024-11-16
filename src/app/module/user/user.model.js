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
      // required: true,
    },
    address: {
      type: String,
    },
    licenseNumber: {
      type: String,
      // required: true,
    },
    firstName: {
      type: String,
      // required: true,
    },
    lastName: {
      type: String,
      // required: true,
    },
    licenseExpiryDate: {
      type: String, // yyyy-mm-dd
      // required: true,
    },
    licenseDateOfBirth: {
      type: String, // yyyy-mm-dd
      // required: true,
    },

    // for host
    accountHolderName: {
      type: String,
      // required: true,
    },
    accountHolderType: {
      type: String,
      // required: true,
    },
    accountNo: {
      type: String,
      // required: true,
    },
    routingNo: {
      type: String,
      // required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    car: {
      type: Number,
    },
    trip: {
      type: Number,
    },
    // cardNum: {
    //   type: Number,
    //   required: true,
    // },
    // expirationDate: {
    //   type: String,
    //   required: true,
    // },
    // cvc: {
    //   type: Number,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);

module.exports = User;
