const sendResponse = require("../../../shared/sendResponse");
const { TripService } = require("./trip.service");
const catchAsync = require("../../../shared/catchasync");

const addTrip = catchAsync(async (req, res) => {
  const result = await TripService.addTrip(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trip added successfully",
    data: result,
  });
});

const getMyTripOrder = catchAsync(async (req, res) => {
  const result = await TripService.getMyTripOrder(req.user, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trips retrieved successfully",
    data: result,
  });
});

const getSingleTrip = catchAsync(async (req, res) => {
  const result = await TripService.getSingleTrip(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trip retrieved successfully",
    data: result,
  });
});

const getAllTrip = catchAsync(async (req, res) => {
  const result = await TripService.getAllTrip(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trips retrieved successfully",
    data: result,
  });
});

const updateTripStatus = catchAsync(async (req, res) => {
  const result = await TripService.updateTripStatus(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Trip ${req.body.status} successfully`,
    data: result,
  });
});

const TripController = {
  addTrip,
  getMyTripOrder,
  getSingleTrip,
  getAllTrip,
  updateTripStatus,
};

module.exports = { TripController };
