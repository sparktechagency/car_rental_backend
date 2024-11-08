const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const Car = require("./car.model");
const Trip = require("../trip/trip.model");
const Auth = require("../auth/auth.model");

const addAndUpdateCar = async (req) => {
  const { files, body: data } = req;
  const { userId, authId } = req.user;

  if (!Object.keys(data).length)
    throw new ApiError(
      status.BAD_REQUEST,
      "Data is missing in the request body!"
    );

  let profile_image;
  if (files && files.profile_image)
    profile_image = `/${files.profile_image[0].path}`;

  const updatedData = { ...data };
  const [auth, user] = await Promise.all([
    Auth.findByIdAndUpdate(
      authId,
      { name: updatedData.name },
      {
        new: true,
      }
    ),
    User.findByIdAndUpdate(
      userId,
      { profile_image, ...updatedData },
      {
        new: true,
      }
    ).populate("authId"),
  ]);

  if (!auth || !user) throw new ApiError(status.NOT_FOUND, "User not found!");

  return user;
};

const getSingleCar = async (query) => {
  const { carId } = query;

  const car = await Car.findById(carId).lean();

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
  addAndUpdateCar,
  getSingleCar,
  getMyCar,
  getAllCar,
  deleteCar,
};

module.exports = { CarService };
