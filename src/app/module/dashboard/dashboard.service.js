const { default: status } = require("http-status");
const Destination = require("../destination/destination.model");
const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");
const Car = require("../car/car.model");
const {
  ENUM_CAR_STATUS,
  ENUM_USER_ROLE,
  ENUM_PAYMENT_STATUS,
} = require("../../../util/enum");
const validateFields = require("../../../util/validateFields");
const User = require("../user/user.model");
const { updateCarAndNotify } = require("../../../util/updateCarAndNotify");
const postNotification = require("../../../util/postNotification");
const Auth = require("../auth/auth.model");
const Payment = require("../payment/payment.model");
const hostWelcomeTemp = require("../../../mail/hostWelcomeTemp");
const { sendEmail } = require("../../../util/sendEmail");

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

  validateFields(query, ["year"]);

  const year = Number(strYear);
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const [distinctYears, revenue] = await Promise.all([
    Payment.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          year: "$_id",
          _id: 0,
        },
      },
    ]),
    Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
          status: ENUM_PAYMENT_STATUS.SUCCEEDED,
        },
      },
      {
        $project: {
          amount: 1,
          refund_amount: 1,
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: {
            $sum: {
              $subtract: ["$amount", "$refund_amount"],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),
  ]);

  const totalYears = distinctYears.map((item) => item.year);

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
  const [totalAuth, totalUser, totalHost, totalCar, totalEarningAgg] =
    await Promise.all([
      Auth.countDocuments(),
      User.countDocuments({ role: ENUM_USER_ROLE.USER }),
      User.countDocuments({ role: ENUM_USER_ROLE.HOST }),
      Car.countDocuments(),
      Payment.aggregate([
        {
          $match: {
            status: ENUM_PAYMENT_STATUS.SUCCEEDED,
          },
        },
        {
          $group: {
            _id: null,
            totalEarning: {
              $sum: {
                $subtract: ["$amount", "$refund_amount"],
              },
            },
          },
        },
      ]),
    ]);

  const totalEarning = totalEarningAgg[0].totalEarning
    ? totalEarningAgg[0].totalEarning
    : 0;

  return {
    totalAuth,
    totalUser,
    totalHost,
    totalCar,
    totalEarning,
  };
};

const growth = async (query) => {
  const { year: yearStr, role } = query;

  validateFields(query, ["role", "year"]);

  const year = Number(yearStr);
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en", { month: "long" })
  );

  // Aggregate monthly registration counts and list of all years
  const [monthlyRegistration, distinctYears] = await Promise.all([
    Auth.aggregate([
      {
        $match: {
          role: role,
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]),
    Auth.aggregate([
      {
        $match: {
          role: role,
        },
      },
      {
        $group: {
          _id: { $year: "$createdAt" },
        },
      },
      {
        $project: {
          year: "$_id",
          _id: 0,
        },
      },
      {
        $sort: {
          year: 1,
        },
      },
    ]),
  ]);

  const total_years = distinctYears.map((item) => item.year);

  // Initialize result object with all months set to 0
  const result = months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {});

  // Populate result with actual registration counts
  monthlyRegistration.forEach(({ month, count }) => {
    result[months[month - 1]] = count;
  });

  return {
    total_years,
    monthlyRegistration: result,
  };
};

// car ========================
const getAllAddCarReq = async (query) => {
  const addCarReqQuery = new QueryBuilder(
    Car.find({ status: { $eq: ENUM_CAR_STATUS.PENDING } })
      .populate({
        path: "user",
        select: "name email profile_image phone_number",
      })
      .lean(),
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

  return {
    meta,
    allAddCarReq,
  };
};

const approveCar = async (query) => {
  /**
   * Approves a car listing.
   * If a user is adding a car for the first time, approval will automatically grant them "Host" status.
   * Additionally, an email notification will be sent informing them of their new status.
   */

  const { carId, status: carStatus } = query;

  validateFields(query, ["carId", "status"]);

  const car = await Car.findById(carId);
  if (!car) throw new ApiError(status.NOT_FOUND, "car not found");

  const user = await User.findById(car.user);
  if (!user) throw new ApiError(status.NOT_FOUND, "owner of car not found");

  if (
    user.role === ENUM_USER_ROLE.USER &&
    carStatus === ENUM_CAR_STATUS.APPROVED
  ) {
    await Promise.all([
      User.findByIdAndUpdate(user._id, { role: ENUM_USER_ROLE.HOST }),
      Auth.updateOne({ _id: user.authId }, { role: ENUM_USER_ROLE.HOST }),
    ]);

    postNotification("Role Updated", `You are a host now.`, user._id);

    try {
      sendEmail({
        email: user.email,
        subject: "Welcome To Nardo",
        html: hostWelcomeTemp({ user: user.name }),
      });
    } catch (error) {
      console.log(error);
      throw new ApiError(status.INTERNAL_SERVER_ERROR, "Email was not sent");
    }
  }

  if (carStatus === ENUM_CAR_STATUS.APPROVED) {
    await User.updateOne(
      {
        _id: car.user,
      },
      { $inc: { carCount: 1 }, $push: { cars: carId } }
    );
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

// user-host management ========================
const getAllUser = async (query) => {
  const { role } = query;

  validateFields(query, ["role"]);

  const allowedRoles = [ENUM_USER_ROLE.USER, ENUM_USER_ROLE.HOST];

  if (!allowedRoles.includes(role))
    throw new ApiError(status.BAD_REQUEST, "Invalid role");

  const usersQuery = new QueryBuilder(
    User.find()
      .populate({ path: "authId", select: "isBlocked" })
      .sort({ createdAt: -1 })
      .lean(),
    query
  )
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    usersQuery.modelQuery,
    usersQuery.countTotal(),
  ]);

  if (!result) throw new ApiError(httpStatus.NOT_FOUND, `No ${role} found`);

  return { meta, result };
};

const getSingleUser = async (query) => {
  const { userId, role } = query;

  validateFields(query, ["userId", "role"]);

  if (role === ENUM_USER_ROLE.HOST) {
    const [cars, user] = await Promise.all([
      Car.find({ user: userId }).sort({ createdAt: -1 }),
      User.findById(userId),
    ]);

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    return { host: user, cars };
  }
  const user = await User.findById(userId);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return { user };
};

const blockUnblockUser = async (payload) => {
  const { authId, isBlocked } = payload;

  validateFields(payload, ["authId"]);

  const user = await Auth.findByIdAndUpdate(
    authId,
    { $set: { isBlocked } },
    {
      new: true,
      runValidators: true,
    }
  ).select("isBlocked email");

  if (!user) throw new ApiError(status.NOT_FOUND, "User not found");

  return user;
};

const DashboardService = {
  addDestination,
  getAllDestination,
  deleteDestination,
  revenue,
  growth,
  totalOverview,
  getAllAddCarReq,
  approveCar,
  getAllUser,
  getSingleUser,
  blockUnblockUser,
};

module.exports = DashboardService;
