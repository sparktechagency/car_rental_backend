const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const Trip = require("../trip/trip.model");
const { ENUM_TRIP_STATUS, ENUM_USER_ROLE } = require("../../../util/enum");
const QueryBuilder = require("../../../builder/queryBuilder");
const dateTimeValidator = require("../../../util/dateTimeValidator");
const postNotification = require("../../../util/postNotification");
const validateFields = require("../../../util/validateFields");
const { isValidDate } = require("../../../util/isValidDate");
const User = require("../user/user.model");
const Car = require("../car/car.model");

const addTrip = async (userData, payload) => {
  const { userId } = userData;
  const {
    carId,
    hostId,
    tripStartDate,
    tripStartTime,
    tripEndDate,
    tripEndTime,
    isPickupAtLocation,
    pickupLocation,
    returnLocation,
    tripPrice,
    maxTripDistance,
  } = payload;

  if (!isPickupAtLocation && !pickupLocation)
    throw new ApiError(status.BAD_REQUEST, "Pickup location is needed");
  if (isPickupAtLocation && pickupLocation)
    throw new ApiError(
      status.BAD_REQUEST,
      "You can only select pick up location or pickup at car location"
    );

  validateFields(payload, [
    "carId",
    "hostId",
    "tripStartDate",
    "tripStartTime",
    "tripEndDate",
    "tripEndTime",
    "returnLocation",
    "tripPrice",
    "maxTripDistance",
  ]);

  dateTimeValidator(tripStartDate, tripStartTime);
  dateTimeValidator(tripEndDate, tripEndTime);

  const tripStartDateTime = new Date(`${tripStartDate} ${tripStartTime}`);
  const tripEndDateTime = new Date(`${tripEndDate} ${tripEndTime}`);

  isValidDate([tripStartDateTime, tripEndDateTime]);

  const tripData = {
    car: carId,
    user: userId,
    host: hostId,
    tripStartDate,
    tripStartTime,
    tripStartDateTime,
    tripEndDate,
    tripEndTime,
    tripEndDateTime,
    isPickupAtLocation: isPickupAtLocation ? isPickupAtLocation : null,
    pickupLocation: pickupLocation ? pickupLocation : null,
    returnLocation,
    tripPrice,
    maxTripDistance,
  };

  const tripExists = await Trip.findOne({
    // user: userId,
    car: carId,
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
  });

  if (tripExists)
    throw new ApiError(
      status.CONFLICT,
      "Trip exists. Select different date & time"
    );

  const result = await Trip.create(tripData);
  return result;
};

const getMyTripOrder = async (userData, query) => {
  const { userId } = userData;
  const { status: tripStatus = ENUM_TRIP_STATUS.REQUESTED } = query || {};

  if (userData.role === ENUM_USER_ROLE.USER) {
    const trips = await Trip.find({ user: userId, status: tripStatus })
      .populate([
        { path: "car" },
        { path: "user" },
        { path: "host", select: "name profile_image rating trip createdAt" },
      ])
      .sort({ createdAt: -1 })
      .lean();

    return {
      count: trips.length,
      trips,
    };
  }

  if (userData.role === ENUM_USER_ROLE.HOST) {
    const trips = await Trip.find({ host: userId, status: tripStatus })
      .populate([
        { path: "car" },
        { path: "user" },
        { path: "host", select: "name profile_image rating trip createdAt" },
      ])
      .sort({ createdAt: -1 })
      .lean();

    return {
      count: trips.length,
      trips,
    };
  }
};

const getSingleTrip = async (query) => {
  const { tripId } = query;

  const trip = await Trip.findById(tripId).populate("car user").lean();

  if (!trip) throw new ApiError(status.NOT_FOUND, "Trip not found");

  return trip;
};

const getAllTrip = async (query) => {
  const tripsQuery = new QueryBuilder(
    Trip.find().populate("user car").lean(),
    query
  )
    .search(["status", "returnLocation", "pickupLocation"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [trips, meta] = await Promise.all([
    tripsQuery.modelQuery,
    tripsQuery.countTotal(),
  ]);

  if (!trips.length) throw new ApiError(status.NOT_FOUND, "Trips not found");

  return {
    meta,
    trips,
  };
};

const updateTripStatus = async (payload) => {
  const { tripId, status: tripStatus } = payload;
  const allowedStatus = [
    ENUM_TRIP_STATUS.CANCELED,
    ENUM_TRIP_STATUS.ONGOING,
    ENUM_TRIP_STATUS.COMPLETED,
  ];

  validateFields(payload, ["tripId", "status"]);

  if (!allowedStatus.includes(tripStatus))
    throw new ApiError(
      status.BAD_REQUEST,
      "Allowed status: 'canceled', 'ongoing', 'completed'"
    );

  let title = "";
  let message = "";
  switch (tripStatus) {
    case ENUM_TRIP_STATUS.CANCELED:
      title = "Trip Canceled";
      message = `Trip ${tripId} is canceled. Refund the user`;
      break;
    case ENUM_TRIP_STATUS.COMPLETED:
      title = "Trip Completed";
      message = `Trip ${tripId} is completed. Pay the host`;
      break;
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    tripId,
    { status: tripStatus },
    { new: true, runValidators: true }
  );

  if (!updatedTrip) throw new ApiError(status.NOT_FOUND, "Trip not found");

  if (tripStatus === ENUM_TRIP_STATUS.COMPLETED) {
    const { user: userId, host: hostId } = updatedTrip;

    Promise.all([
      User.updateOne(
        { _id: hostId },
        {
          $inc: { trip: 1 },
        }
      ),
      Car.updateOne(
        { _id: updatedTrip.car },
        {
          $inc: { trip: 1 },
        }
      ),
    ]);

    postNotification(
      "Trip Completed",
      "You have completed the trip. Admin will transfer your payment shortly",
      hostId
    );
    postNotification(
      "Trip Completed",
      "You have completed the trip. Leave a review",
      userId
    );
  }

  postNotification(title, message);

  return updatedTrip;
};

const TripService = {
  addTrip,
  getMyTripOrder,
  getSingleTrip,
  getAllTrip,
  updateTripStatus,
};

module.exports = { TripService };
