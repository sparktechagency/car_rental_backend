const { default: status } = require("http-status");
const Destination = require("../destination/destination.model");
const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");
const Car = require("../car/car.model");
const { ENUM_CAR_STATUS, ENUM_USER_ROLE } = require("../../../util/enum");
const validateFields = require("../../../util/validateFields");
const User = require("../user/user.model");
const { updateCarAndNotify } = require("../../../util/updateCarAndNotify");
const postNotification = require("../../../util/postNotification");
const Auth = require("../auth/auth.model");

// destination ========================
const addDestination = async (req) => {
  const { files, body: data } = req;
  const { name } = data || {};

  if (!Object.keys(data).length)
    throw new ApiError(
      status.BAD_REQUEST,
      "Data is missing in the request body!"
    );

  if (!files || !files.destination_image)
    throw new ApiError(status.BAD_REQUEST, "Destination Image is required");

  let destination_image;
  if (files && files.destination_image)
    destination_image = `/${files.destination_image[0].path}`;

  const existingDestination = await Destination.findOne({ name }).collation({
    locale: "en",
    strength: 2,
  });

  if (existingDestination)
    throw new ApiError(status.CONFLICT, `Destination ${name} exists`);

  const destinationData = { name, destination_image };

  const destination = await Destination.create(destinationData);

  return destination;
};

const getAllDestination = async (query) => {
  const destinationQuery = new QueryBuilder(Destination.find({}).lean(), query)
    .search(["name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [destinations, meta] = await Promise.all([
    destinationQuery.modelQuery,
    destinationQuery.countTotal(),
  ]);

  if (!destinations.length)
    throw new ApiError(status.NOT_FOUND, "Destinations not found");

  return {
    meta,
    destinations,
  };
};

const deleteDestination = async (query) => {
  const { destinationId } = query;

  const result = await Destination.deleteOne({ _id: destinationId });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "Destination not found");

  return result;
};

// overview ========================
const revenue = async (query) => {
  const { year: strYear } = query;
  const year = Number(strYear);

  if (!year) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing year");
  }

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const distinctYears = await Transaction.aggregate([
    {
      $group: {
        _id: { $year: "$createdAt" },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $project: {
        year: "$_id",
        _id: 0,
      },
    },
  ]);

  const totalYears = distinctYears.map((item) => item.year);

  const revenue = await Subscription.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
        // paymentStatus: "succeeded", // Only include successful payments
      },
    },
    {
      $project: {
        price: 1, // Only keep the price field
        month: { $month: "$createdAt" }, // Extract the month from createdAt
      },
    },
    {
      $group: {
        _id: "$month", // Group by the month
        totalRevenue: { $sum: "$price" }, // Sum up the price for each month
      },
    },
    {
      $sort: { _id: 1 }, // Sort the result by month (ascending)
    },
  ]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyRevenue = monthNames.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  revenue.forEach((r) => {
    const monthName = monthNames[r._id - 1];
    monthlyRevenue[monthName] = r.totalRevenue;
  });

  return {
    total_years: totalYears,
    monthlyRevenue,
  };
};

const totalOverview = async () => {
  const [totalAuth, totalUser] = await Promise.all([
    Auth.countDocuments(),
    User.countDocuments(),
    Services.countDocuments(),
  ]);

  return {
    totalAuth,
    totalUser,
  };
};

// car ========================
const getAllAddCarReq = async (query) => {
  const addCarReqQuery = new QueryBuilder(
    Car.find({ status: { $eq: ENUM_CAR_STATUS.PENDING } }).lean(),
    query
  )
    .search(["make model year licensePlateNum"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [allAddCarReq, meta] = await Promise.all([
    addCarReqQuery.modelQuery,
    addCarReqQuery.countTotal(),
  ]);

  if (!allAddCarReq.length)
    throw new ApiError(status.NOT_FOUND, "Add car requests not found");

  return {
    meta,
    allAddCarReq,
  };
};

const approveCar = async (query) => {
  const { carId, status: carStatus } = query;

  validateFields(query, ["carId", "status"]);

  const car = await Car.findById(carId);
  const user = await User.findById(car.user);

  if (
    user.role === ENUM_USER_ROLE.USER &&
    carStatus === ENUM_CAR_STATUS.APPROVED
  ) {
    await Promise.all([
      User.findByIdAndUpdate(user._id, { role: ENUM_USER_ROLE.HOST }),
      Auth.updateOne({ _id: user.authId }, { role: ENUM_USER_ROLE.HOST }),
    ]);

    postNotification("Role Updated", `You are a host now.`, user._id);
  }

  const updatedCar = await updateCarAndNotify(
    carId,
    { status: carStatus },
    car.user,
    carStatus === ENUM_CAR_STATUS.APPROVED
      ? "Your car listing is approved."
      : "Your car listing was declined. Please check and resubmit.",
    `Car ${carStatus}`
  );

  return updatedCar;
};

const DashboardService = {
  addDestination,
  getAllDestination,
  deleteDestination,
  revenue,
  totalOverview,
  getAllAddCarReq,
  approveCar,
};

module.exports = DashboardService;
