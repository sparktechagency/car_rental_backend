const catchAsync = require("../../../shared/catchasync");
const sendResponse = require("../../../shared/sendResponse");
const DashboardService = require("./dashboard.service");

// destination ========================
const addDestination = catchAsync(async (req, res) => {
  const result = await DashboardService.addDestination(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destination added successfully",
    data: result,
  });
});

const getAllDestination = catchAsync(async (req, res) => {
  const result = await DashboardService.getAllDestination(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destination retrieved successfully",
    data: result,
  });
});

const deleteDestination = catchAsync(async (req, res) => {
  const result = await DashboardService.deleteDestination(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Destination deleted successfully",
    data: result,
  });
});

// overview ========================
const totalOverview = catchAsync(async (req, res) => {
  const result = await DashboardService.totalOverview();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Total overview retrieved successfully",
    data: result,
  });
});

const revenue = catchAsync(async (req, res) => {
  const result = await DashboardService.revenue(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Revenue retrieved successfully",
    data: result,
  });
});

const DashboardController = {
  addDestination,
  getAllDestination,
  deleteDestination,
  totalOverview,
  revenue,
};

module.exports = DashboardController;
