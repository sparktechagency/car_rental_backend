const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const carSchema = new Schema(
  {
    host: {
      type: ObjectId,
      ref: "Host",
      required: true,
    },
    carAddress: {
      type: String,
      required: true,
    },
    licensePlateNum: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    // odometer: {
    //   type: String,
    //   required: true,
    // },
    features: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    bags: {
      type: String,
      required: true,
    },
    doors: {
      type: String,
      required: true,
    },
    carType: {
      type: String,
      required: true,
    },
    isElectric: {
      type: Boolean,
    },
    fuelType: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      required: true,
    },
    car_image: {
      type: Array,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    distanceIncluded: {
      type: String,
    },
    ratings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Car = model("Car", carSchema);

module.exports = Car;
