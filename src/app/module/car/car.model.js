const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const carSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      // required: true,
    },
    // car related
    carAddress: {
      type: String, // map address
      // required: true,
    },
    destination: {
      type: String, // destination
      // required: true,
    },
    licensePlateNum: {
      type: String,
      // required: true,
    },
    make: {
      type: String,
      // required: true,
    },
    model: {
      type: String,
      // required: true,
    },
    year: {
      type: Number,
      // required: true,
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      // required: true,
    },
    isElectric: {
      type: Boolean,
      default: false,
    },
    carType: {
      type: String,
      enum: ["luxury", "standard"],
      // required: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "suv", "bus", "minivan", "truck", "van", "cargo-van"],
      // required: true,
    },
    maxTravelDistancePerDay: {
      type: Number,
      // required: true,
    },
    finePerKm: {
      type: Number,
      // required: true,
    },
    features: {
      type: Array,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    seats: {
      type: Number,
      // required: true,
    },
    bags: {
      type: Number,
      // required: true,
    },
    doors: {
      type: Number,
      // required: true,
    },
    fuelType: {
      type: String,
      // required: true,
    },
    discountDays: {
      type: Number,
      // required: true,
    },
    discountAmount: {
      type: Number,
      // required: true,
    },
    car_image: {
      type: Array,
      // required: true,
    },
    pricePerDay: {
      type: Number,
      // required: true,
    },
    deliveryFee: {
      type: Number,
      // required: true,
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
    avgRating: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
    },

    // host details
    hostLicenseNumber: {
      type: String,
      // required: true,
    },
    hostFirstName: {
      type: String,
      // required: true,
    },
    hostLastName: {
      type: String,
      // required: true,
    },
    hostLicenseExpiryDate: {
      type: String, // yyyy-mm-dd
      // required: true,
    },
    hostLicenseDateOfBirth: {
      type: String, // yyyy-mm-dd
      // required: true,
    },
  },
  { timestamps: true }
);

carSchema.index({ location: "2dsphere" });

const Car = model("Car", carSchema);

module.exports = Car;
