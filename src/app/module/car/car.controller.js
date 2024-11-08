const sendResponse = require("../../../shared/sendResponse");
const { CarService } = require("./car.service");
const catchAsync = require("../../../shared/catchasync");

const addAndUpdateCar = catchAsync(async (req, res) => {
  const result = await CarService.addAndUpdateCar(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const getSingleCar = catchAsync(async (req, res) => {
  const result = await CarService.getSingleCar(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car retrieved successfully",
    data: result,
  });
});

const getMyCar = catchAsync(async (req, res) => {
  const result = await CarService.getMyCar(req.user, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cars retrieved successfully",
    data: result,
  });
});

const getAllCar = catchAsync(async (req, res) => {
  const result = await CarService.getAllCar(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cars retrieved successfully",
    data: result,
  });
});

const deleteCar = catchAsync(async (req, res) => {
  const result = await CarService.deleteCar(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car deleted!",
    data: result,
  });
});

const CarController = {
  addAndUpdateCar,
  getSingleCar,
  getMyCar,
  getAllCar,
  deleteCar,
};

module.exports = { CarController };
