const { default: status } = require("http-status");
const Destination = require("../destination/destination.model");
const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");

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

const DashboardService = {
  addDestination,
  getAllDestination,
  deleteDestination,
  revenue,
  totalOverview,
};

module.exports = DashboardService;
