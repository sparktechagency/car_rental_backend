const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const carSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    // car details
    carAddress: {
      type: String, // map address
      required: true,
    },
    destination: {
      type: String, // destination
      required: true,
    },
    licensePlateNum: {
      type: String,
    },
    make: {
      type: String,
    },
    model: {
      type: String,
    },
    year: {
      type: Number,
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
    },
    isElectric: {
      type: Boolean,
      default: false,
    },
    carType: {
      type: String,
      enum: ["luxury", "standard"],
    },
    vehicleType: {
      type: String,
      enum: ["car", "suv", "bus", "minivan", "truck", "van", "cargo-van"],
    },
    maxTravelDistancePerDay: {
      type: Number,
    },
    finePerKm: {
      type: Number,
    },
    features: {
      type: Array,
    },
    description: {
      type: String,
    },
    seats: {
      type: Number,
    },
    bags: {
      type: Number,
    },
    doors: {
      type: Number,
    },
    fuelType: {
      type: String,
    },
    discountDays: {
      type: Number,
    },
    discountAmount: {
      type: Number,
    },
    car_image: {
      type: Array,
    },
    pricePerDay: {
      type: Number,
    },
    deliveryFee: {
      type: Number,
    },
    youngDriverFee: {
      type: Number,
    },
    cleaningFee: {
      type: Number,
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
    rating: {
      type: Number,
      default: 0,
    },
    trip: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "canceled"],
    },

    // host details
    hostLicenseFrontImage: {
      type: String,
    },
    hostLicenseBackImage: {
      type: String,
    },
  },
  { timestamps: true }
);

carSchema.index({ location: "2dsphere" });

const Car = model("Car", carSchema);

module.exports = Car;
