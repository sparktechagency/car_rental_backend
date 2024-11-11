const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const Car = require("./car.model");
const Trip = require("../trip/trip.model");
const Auth = require("../auth/auth.model");
const postNotification = require("../../../util/postNotification");
const { default: axios } = require("axios");
const config = require("../../../config");
const validateFields = require("../../../util/validateFields");
const { ENUM_CAR_STATUS } = require("../../../util/enum");
const { updateCarAndNotify } = require("../../../util/updateCarAndNotify");

// const addAndUpdateCar = async (req) => {
//   const { files, body: data } = req;
//   const { userId, authId } = req.user;
//   const { location } = data;
//   const carData = {
//     user: userId,
//     carAddress: carAddress || null,
//     location: {
//       coordinates: [Number(longitude), Number(latitude)],
//     },
//     destination: destination || null,
//     licensePlateNum: licensePlateNum || null,
//     make: make || null,
//     model: model || null,
//     year: year || null,
//     transmission: "" || null,
//     isElectric: "" || null,
//     carType: "" || null,
//     vehicleType: "" || null,
//     maxTravelDistancePerDay: "" || null,
//     finePerKm: "" || null,
//     features: "" || null,
//     description: "" || null,
//     seats: "" || null,
//     bags: "" || null,
//     doors: "" || null,
//     fuelType: "" || null,
//     discountDays: "" || null,
//     discountAmount: "" || null,
//     car_image: "" || [],
//     pricePerDay: "" || null,
//     deliveryFee: "" || null,
//     location: "" || null,
//     hostLicenseNumber: "" || null,
//     hostFirstName: "" || null,
//     hostLastName: "" || null,
//     hostLicenseExpiryDate: "" || null,
//     hostLicenseDateOfBirth: "" || null,
//   };

//   if (!longitude || !latitude)
//     throw new ApiError(
//       status.BAD_REQUEST,
//       "longitude and latitude is required"
//     );

//   if (!user) throw new ApiError(status.NOT_FOUND, "User not found!");

//   return user;
// };

const addLocation = async (userData, payload) => {
  const { userId } = userData;
  const { carAddress, longitude, latitude, destination } = payload;

  validateFields(payload, [
    "carAddress",
    "longitude",
    "latitude",
    "destination",
  ]);

  const isExists = await Car.findOne({
    user: userId,
    status: { $exists: false },
  }).lean();

  if (isExists) {
    throw new ApiError(
      status.CONFLICT,
      `ERR_CAR_SUBMISSION_INCOMPLETE: Finish the current car submission (ID: ${isExists._id}) before adding a new one.`
    );
  }

  const carData = {
    user: userId,
    carAddress,
    location: {
      coordinates: [Number(longitude), Number(latitude)],
    },
    destination,
  };

  const car = await Car.create(carData);

  postNotification("New Car", "You have started adding a new car", userId);

  return car;
};

const updateCarLicense = async (userData, payload) => {
  const { userId } = userData;
  const { carId, licensePlateNum } = payload;
  let res;

  validateFields(payload, ["carId", "licensePlateNum"]);

  try {
    res = await axios.post(
      "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      { registrationNumber: licensePlateNum },
      {
        headers: {
          "x-api-key": `${config.dvla.x_api_key}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new ApiError(
      Number(error.response.data.errors[0].status),
      error.response.data.errors[0].detail
    );
  }

  if (res.data.registrationNumber) {
    const updatedCar = await updateCarAndNotify(
      carId,
      { licensePlateNum },
      userId,
      "You have updated the license plate number of your car"
    );

    return updatedCar;
  }
};

const updateMakeModelYear = async (userData, payload) => {
  const { userId } = userData;
  const { carId, make, model, year } = payload;

  validateFields(payload, ["carId", "make", "model", "year"]);

  const updatedCar = await updateCarAndNotify(
    carId,
    { make, model, year },
    userId,
    "You have updated the make, model, year of your car"
  );

  return updatedCar;
};

const updateTransmission = async (userData, payload) => {
  const { userId } = userData;
  const { carId, transmission, isElectric, carType, vehicleType } = payload;

  validateFields(payload, [
    "carId",
    "transmission",
    "isElectric",
    "carType",
    "vehicleType",
  ]);

  const updatedCar = await updateCarAndNotify(
    carId,
    { transmission, isElectric, carType, vehicleType },
    userId,
    "You have updated transmission, car type, vehicle type of your car"
  );

  return updatedCar;
};

const updateHostLicense = async (userData, payload) => {
  const { userId } = userData;
  const {
    carId,
    pricePerDay,
    maxTravelDistancePerDay,
    finePerKm,
    hostLicenseNumber,
    hostFirstName,
    hostLastName,
    hostLicenseExpiryDate,
    hostLicenseDateOfBirth,
  } = payload;

  validateFields(payload, [
    "carId",
    "pricePerDay",
    "maxTravelDistancePerDay",
    "finePerKm",
    "hostLicenseNumber",
    "hostFirstName",
    "hostLastName",
    "hostLicenseExpiryDate",
    "hostLicenseDateOfBirth",
  ]);

  const updatedCar = await updateCarAndNotify(
    carId,
    {
      pricePerDay,
      maxTravelDistancePerDay,
      finePerKm,
      hostLicenseNumber,
      hostFirstName,
      hostLastName,
      hostLicenseExpiryDate,
      hostLicenseDateOfBirth,
    },
    userId,
    "You have updated host license details for your car"
  );

  return updatedCar;
};

const updateDetails = async (userData, payload) => {
  const { userId } = userData;
  const { carId, features, description } = payload;

  validateFields(payload, ["carId", "features", "description"]);

  const updatedCar = await updateCarAndNotify(
    carId,
    { features, description },
    userId,
    "You have updated features and description of your car"
  );

  return updatedCar;
};

const updatePhotos = async (req) => {
  const { user: userData, body: payload, files } = req;
  const { userId } = userData;
  const { car_image } = files || {};
  const {
    carId,
    seats,
    bags,
    doors,
    fuelType,
    discountDays,
    discountAmount,
    deliveryFee,
  } = payload;

  if (!car_image) throw new ApiError(status.BAD_REQUEST, "Missing car image");

  validateFields(payload, [
    "carId",
    "seats",
    "bags",
    "doors",
    "fuelType",
    "discountDays",
    "discountAmount",
    "deliveryFee",
  ]);

  const carImageMapped = car_image.map((img) => img.path);

  const updatedCar = await updateCarAndNotify(
    carId,
    {
      seats,
      bags,
      doors,
      fuelType,
      discountDays,
      discountAmount,
      deliveryFee,
      car_image: carImageMapped,
    },
    userId,
    "You have updated car details and images"
  );

  return updatedCar;
};

const updateHostPaymentDetails = async (userData, payload) => {
  const { userId } = userData;
};

const sendAddCarReq = async (userData, query) => {
  const { userId, role } = userData;
  const { carId } = query;

  if (!carId) throw new ApiError(status.BAD_REQUEST, "Missing car Id");

  const car = await Car.findById(carId);

  if (!car) throw new ApiError(status.NOT_FOUND, "Car not found");

  const requiredFields = [
    "carAddress",
    "location",
    "destination",
    "licensePlateNum",
    "year",
    "make",
    "model",
    "transmission",
    "carType",
    "vehicleType",
    "hostLicenseNumber",
    "hostFirstName",
    "hostLastName",
    "hostLicenseExpiryDate",
    "hostLicenseDateOfBirth",
    "pricePerDay",
    "maxTravelDistancePerDay",
    "finePerKm",
    "features",
    "description",
    "seats",
    "bags",
    "doors",
    "fuelType",
    "discountDays",
    "discountAmount",
    "car_image",
    "deliveryFee",
    "location",
  ];

  validateFields(car, requiredFields);

  const updatedCar = await Car.updateOne(
    { _id: carId },
    { status: ENUM_CAR_STATUS.PENDING }
  );

  postNotification(
    "Add Car Request Sent",
    "Request sent to admin. Please wait for verification. For first-time car requests, admin approval is needed before accessing host features",
    userId
  );
  postNotification(
    `${role} New Car Request`,
    "A new car has been added. Please approve."
  );

  return updatedCar;
};

const updateAllCarData = async (userData, payload) => {
  const { carId } = payload;

  validateFields(payload, ["carId"]);

  const updatedCar = await updateCarAndNotify(
    carId,
    payload,
    userData.userId,
    "You have updated your car's information"
  );

  return updatedCar;
};

const getSingleCar = async (query) => {
  const { carId } = query;

  const car = await Car.findById(carId).populate("user").lean();

  if (!car) throw new ApiError(status.NOT_FOUND, "Car not found");

  return car;
};

const getMyCar = async (userData) => {
  const { userId } = userData;

  const cars = await Car.find({ host: userId }).lean();

  if (!cars.length) throw new ApiError(status.NOT_FOUND, "Cars not found");

  return cars;
};

const getAllCar = async (query) => {
  const {
    latitude,
    longitude,
    fromDate,
    fromTime,
    toDate,
    toTime,
    minPrice = 1,
    maxPrice,
    vehicleType,
    make,
    year,
    model,
    seats,
    isElectric,
  } = query;

  const tripStartDateTime = new Date(`${fromDate} ${fromTime}`);
  const tripEndDateTime = new Date(`${toDate} ${toTime}`);
  console.log(tripStartDateTime, typeof tripStartDateTime);

  const test = await Auth.find({
    createdAt: "2024-10-31T09:44:33.436+00:00",
  });
  // const test = await Trip.find({
  //   tripStartDateTime: "2024-10-01T04:30:00.000Z",
  // });
  // const test = await Trip.find({
  //   tripStartTime: "08:00 AM",
  // });

  console.log(test);
  // const test = await Trip.findOne({});
  // const
  // console.log(test.tripStartDateTime.getTime() === tripStartDateTime.getTime());

  const unavailableCars = await Trip.find({
    $or: [
      {
        tripStartDateTime: { $lte: tripEndDateTime, $gte: tripStartDateTime },
      },
      {
        tripEndDateTime: { $lte: tripEndDateTime, $gte: tripStartDateTime },
      },
      {
        tripStartDateTime: { $lte: tripStartDateTime },
        tripEndDateTime: { $gte: tripEndDateTime },
      },
    ],
  }).select("car");
  console.log(unavailableCars);
  const unavailableCarIds = unavailableCars.map((trip) => trip.car);

  // Step 3: Query `Car` collection with filters, excluding unavailable cars
  const searchFilters = {
    _id: { $nin: unavailableCarIds }, // Exclude unavailable cars
  };

  if (maxPrice) searchFilters.pricePerDay = { $gte: minPrice, $lte: maxPrice };
  if (vehicleType) searchFilters.vehicleType = vehicleType;
  if (make) searchFilters.make = make;
  if (year) searchFilters.year = year;
  if (model) searchFilters.model = model;
  if (seats) searchFilters.seats = { $gte: seats };
  if (isElectric) searchFilters.isElectric = isElectric;

  if (latitude && longitude) {
    searchFilters.location = {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        // $maxDistance: 5000000,
      },
    };
  }

  const availableCars = await Car.find(searchFilters)
    .collation({
      locale: "en",
      strength: 2,
    })
    //   .select("seats");
    .select("pricePerDay");

  // const availableCars = await Car.find({
  //   _id: { $nin: unavailableCarIds }, // Exclude unavailable cars
  //   ...(maxPrice && { pricePerDay: { $gte: minPrice, $lte: maxPrice } }),
  //   ...(vehicleType && { vehicleType }),
  //   ...(make && { make }),
  //   ...(year && { year }),
  //   ...(model && { model }),
  //   ...(seats && { seats: { $gte: seats } }),
  //   ...(isElectric && { isElectric }),
  //   ...(latitude &&
  //     longitude && {
  //       location: {
  //         $nearSphere: {
  //           $geometry: {
  //             type: "Point",
  //             coordinates: [longitude, latitude],
  //           },
  //           // $maxDistance: 5000000,
  //         },
  //       },
  //     }),
  // }).collation({ locale: "en", strength: 2 });
  //   .select("seats");
  //   .select("pricePerDay");

  return {
    count: availableCars.length,
    availableCars,
  };
};

const deleteCar = async (query) => {
  const { carId } = query;

  const result = await Car.deleteOne(carId);

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "Car not found");

  return result;
};

const CarService = {
  addLocation,
  updateCarLicense,
  updateMakeModelYear,
  updateTransmission,
  updateHostLicense,
  updateDetails,
  updatePhotos,
  updateHostPaymentDetails,
  sendAddCarReq,
  updateAllCarData,
  getSingleCar,
  getMyCar,
  getAllCar,
  deleteCar,
};

module.exports = { CarService };
