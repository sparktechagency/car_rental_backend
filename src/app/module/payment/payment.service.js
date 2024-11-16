const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const QueryBuilder = require("../../../builder/queryBuilder");
const validateFields = require("../../../util/validateFields");
const Payment = require("./payment.model");
const { ENUM_PAYMENT_STATUS } = require("../../../util/enum");
const { default: mongoose } = require("mongoose");

const getAllPayment = async (query) => {
  const paymentQuery = new QueryBuilder(
    Payment.find({}).populate("user host car"),
    query
  )
    .search(["checkout_session_id", "payment_intent_id"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [result, meta] = await Promise.all([
    paymentQuery.modelQuery,
    paymentQuery.countTotal(),
  ]);

  if (!result.length) throw new ApiError(status.NOT_FOUND, "Payment not found");

  return {
    meta,
    result,
  };
};

const hostRevenueChart = async (userData, query) => {
  const { userId } = userData;
  const { year: strYear } = query;
  const year = Number(strYear);

  validateFields(query, ["year"]);

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  const hostObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

  const distinctYears = await Payment.aggregate([
    {
      $match: {
        host: hostObjectId,
      },
    },
    {
      $group: {
        _id: { $year: "$createdAt" },
      },
    },
    {
      $sort: { _id: 1 }, // Sort years in ascending order
    },
    {
      $project: {
        year: "$_id",
        _id: 0,
      },
    },
  ]);

  const totalYears = distinctYears.map((item) => item.year);

  const revenue = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
        status: ENUM_PAYMENT_STATUS.SUCCEEDED,
        host: hostObjectId,
      },
    },
    {
      $project: {
        amount: 1,
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        totalRevenue: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
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

const hostIncomeDetails = async (userData) => {
  const { userId: hostId } = userData;

  const hostObjectId = mongoose.Types.ObjectId.createFromHexString(hostId);

  const incomeDetails = await Payment.aggregate([
    {
      $match: {
        host: hostObjectId,
        status: ENUM_PAYMENT_STATUS.SUCCEEDED,
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        totalMonthlyIncome: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: { year: "$_id.year" },
        totalYearlyIncome: { $sum: "$totalMonthlyIncome" },
        monthsCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$totalYearlyIncome" },
        totalYears: { $sum: 1 },
        totalMonths: { $sum: "$monthsCount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: { $floor: "$totalIncome" },
        averageMonthlyIncome: {
          $cond: {
            if: { $gt: ["$totalMonths", 0] },
            then: { $floor: { $divide: ["$totalIncome", "$totalMonths"] } },
            else: 0,
          },
        },
        averageYearlyIncome: {
          $cond: {
            if: { $gt: ["$totalYears", 0] },
            then: { $floor: { $divide: ["$totalIncome", "$totalYears"] } },
            else: 0,
          },
        },
      },
    },
  ]);

  return incomeDetails.length > 0 ? incomeDetails[0] : null;
};

const PaymentService = {
  getAllPayment,
  hostRevenueChart,
  hostIncomeDetails,
};

module.exports = { PaymentService };
