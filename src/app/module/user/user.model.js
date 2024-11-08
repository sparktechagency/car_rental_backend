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
    profile_image: {
      type: String,
    },
    phone_number: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: String,
    },
    address: {
      type: String,
    },

    // bank info
    accountHolderName: {
      type: String,
      required: true,
    },
    accountHolderType: {
      type: String,
      required: true,
    },
    accountNo: {
      type: String,
      required: true,
    },
    routingNo: {
      type: String,
      required: true,
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
