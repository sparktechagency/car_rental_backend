const sendResponse = require("../../../shared/sendResponse");
const { CarService } = require("./car.service");
const catchAsync = require("../../../shared/catchAsync");

const addLocation = catchAsync(async (req, res) => {
  const result = await CarService.addLocation(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "New Car Added successfully",
    data: result,
  });
});

const updateCarLicense = catchAsync(async (req, res) => {
  const result = await CarService.updateCarLicense(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const updateMakeModelYear = catchAsync(async (req, res) => {
  const result = await CarService.updateMakeModelYear(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const updateTransmission = catchAsync(async (req, res) => {
  const result = await CarService.updateTransmission(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const updateHostLicense = catchAsync(async (req, res) => {
  const result = await CarService.updateHostLicense(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const updateDetails = catchAsync(async (req, res) => {
  const result = await CarService.updateDetails(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const updatePhotos = catchAsync(async (req, res) => {
  const result = await CarService.updatePhotos(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const sendAddCarReq = catchAsync(async (req, res) => {
  const result = await CarService.sendAddCarReq(req.user, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car request sent successfully",
    data: result,
  });
});

const updateAllCarData = catchAsync(async (req, res) => {
  const result = await CarService.updateAllCarData(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Car updated successfully",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const result = await CarService.getAllBrands();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brands retrieved successfully",
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

const getDistinctMakeModelYear = catchAsync(async (req, res) => {
  const result = await CarService.getDistinctMakeModelYear(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Make model and year retrieved successfully",
    data: result,
  });
});

const topHostsInDestination = catchAsync(async (req, res) => {
  const result = await CarService.topHostsInDestination(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top hosts in destination with cars retrieved successfully",
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

const getMakeFromAPI = catchAsync(async (req, res) => {
  const result = await CarService.getMakeFromAPI(req.query);
  res.json({ result });
  // sendResponse(res, {
  //   statusCode: 200,
  //   success: true,
  //   message: "Data retrieved",
  //   data: result,
  // });
});

const getModelFromAPI = catchAsync(async (req, res) => {
  const result = await CarService.getModelFromAPI(req.query);
  res.json({ result });
  // sendResponse(res, {
  //   statusCode: 200,
  //   success: true,
  //   message: "Data retrieved",
  //   data: result,
  // });
});

const CarController = {
  addLocation,
  updateCarLicense,
  updateMakeModelYear,
  updateTransmission,
  updateHostLicense,
  updateDetails,
  updatePhotos,
  sendAddCarReq,
  updateAllCarData,
  getAllBrands,
  getSingleCar,
  getMyCar,
  getAllCar,
  getDistinctMakeModelYear,
  topHostsInDestination,
  deleteCar,
  getMakeFromAPI,
  getModelFromAPI,
};

module.exports = { CarController };
