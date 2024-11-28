const catchAsync = require("../../../shared/catchasync");
const sendResponse = require("../../../shared/sendResponse");
const ManageService = require("./manage.service");

const addTermsConditions = catchAsync(async (req, res) => {
  const result = await ManageService.addTermsConditions(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getTermsConditions = catchAsync(async (req, res) => {
  const result = await ManageService.getTermsConditions();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deleteTermsConditions = catchAsync(async (req, res) => {
  const result = await ManageService.deleteTermsConditions(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const addPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await ManageService.addPrivacyPolicy(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await ManageService.getPrivacyPolicy();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deletePrivacyPolicy = catchAsync(async (req, res) => {
  const result = await ManageService.deletePrivacyPolicy(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const addAboutUs = catchAsync(async (req, res) => {
  const result = await ManageService.addAboutUs(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getAboutUs = catchAsync(async (req, res) => {
  const result = await ManageService.getAboutUs();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deleteAboutUs = catchAsync(async (req, res) => {
  const result = await ManageService.deleteAboutUs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const addFaq = catchAsync(async (req, res) => {
  const result = await ManageService.addFaq(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getFaq = catchAsync(async (req, res) => {
  const result = await ManageService.getFaq();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deleteFaq = catchAsync(async (req, res) => {
  const result = await ManageService.deleteFaq(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const addContactUs = catchAsync(async (req, res) => {
  const result = await ManageService.addContactUs(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getContactUs = catchAsync(async (req, res) => {
  const result = await ManageService.getContactUs();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deleteContactUs = catchAsync(async (req, res) => {
  const result = await ManageService.deleteContactUs(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const addTipsTricks = catchAsync(async (req, res) => {
  const result = await ManageService.addTipsTricks(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getTipsTricks = catchAsync(async (req, res) => {
  const result = await ManageService.getTipsTricks();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deleteTipsTricks = catchAsync(async (req, res) => {
  const result = await ManageService.deleteTipsTricks(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const addTrustSafety = catchAsync(async (req, res) => {
  const result = await ManageService.addTrustSafety(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getTrustSafety = catchAsync(async (req, res) => {
  const result = await ManageService.getTrustSafety();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deleteTrustSafety = catchAsync(async (req, res) => {
  const result = await ManageService.deleteTrustSafety(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const addHostGuidelines = catchAsync(async (req, res) => {
  const result = await ManageService.addHostGuidelines(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Successful",
    data: result.result ? result.result : result,
  });
});

const getHostGuidelines = catchAsync(async (req, res) => {
  const result = await ManageService.getHostGuidelines();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successful",
    data: result,
  });
});

const deleteHostGuidelines = catchAsync(async (req, res) => {
  const result = await ManageService.deleteHostGuidelines(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deletion Successful",
    data: result,
  });
});

const ManageController = {
  addPrivacyPolicy,
  getPrivacyPolicy,
  deletePrivacyPolicy,
  addTermsConditions,
  getTermsConditions,
  deleteTermsConditions,
  addAboutUs,
  getAboutUs,
  deleteAboutUs,
  addFaq,
  getFaq,
  deleteFaq,
  addContactUs,
  getContactUs,
  deleteContactUs,
  addTipsTricks,
  getTipsTricks,
  deleteTipsTricks,
  addTrustSafety,
  getTrustSafety,
  deleteTrustSafety,
  addHostGuidelines,
  getHostGuidelines,
  deleteHostGuidelines,
};

module.exports = ManageController;
