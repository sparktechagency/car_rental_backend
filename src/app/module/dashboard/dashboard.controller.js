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

// car ========================
const getAllAddCarReq = catchAsync(async (req, res) => {
  const result = await DashboardService.getAllAddCarReq(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Add car requests retrieved successfully",
    data: result,
  });
});

const approveCar = catchAsync(async (req, res) => {
  const result = await DashboardService.approveCar(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car status updated successfully",
    data: result,
  });
});

// user-host management ========================
const getAllUser = catchAsync(async (req, res) => {
  const result = await DashboardService.getAllUser(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await DashboardService.getSingleUser(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Details retrieved successfully",
    data: result,
  });
});

const blockUnblockUser = catchAsync(async (req, res) => {
  const result = await DashboardService.blockUnblockUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blocked successfully",
    data: result,
  });
});

const DashboardController = {
  addDestination,
  getAllDestination,
  deleteDestination,
  totalOverview,
  revenue,
  getAllAddCarReq,
  approveCar,
  getAllUser,
  getSingleUser,
  blockUnblockUser,
};

module.exports = DashboardController;
