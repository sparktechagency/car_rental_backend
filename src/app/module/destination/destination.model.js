const { Schema, model } = require("mongoose");

const destinationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    destination_image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Destination = model("Destination", destinationSchema);

module.exports = Destination;
