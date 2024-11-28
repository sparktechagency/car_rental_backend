const { default: status } = require("http-status");
const {
  TermsConditions,
  PrivacyPolicy,
  AboutUs,
  FAQ,
  ContactUs,
  HostGuidelines,
  TipsTricks,
  TrustSafety,
} = require("../manage/manage.model");
const ApiError = require("../../../error/ApiError");
const validateFields = require("../../../util/validateFields");

const addTermsConditions = async (payload) => {
  const checkIsExist = await TermsConditions.findOne();

  if (checkIsExist) {
    const result = await TermsConditions.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Terms & conditions updated",
      result,
    };
  } else {
    return await TermsConditions.create(payload);
  }
};

const getTermsConditions = async () => {
  return await TermsConditions.findOne();
};

const deleteTermsConditions = async (query) => {
  const { id } = query;

  const result = await TermsConditions.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "TermsConditions not found");

  return result;
};

const addPrivacyPolicy = async (payload) => {
  const checkIsExist = await PrivacyPolicy.findOne();

  if (checkIsExist) {
    const result = await PrivacyPolicy.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Privacy policy updated",
      result,
    };
  } else {
    return await PrivacyPolicy.create(payload);
  }
};

const getPrivacyPolicy = async () => {
  return await PrivacyPolicy.findOne();
};

const deletePrivacyPolicy = async (query) => {
  const { id } = query;

  const result = await PrivacyPolicy.deleteOne({ _id: id });

  if (!result.deletedCount) {
    throw new ApiError(status.NOT_FOUND, "Privacy Policy not found");
  }

  return result;
};

const addAboutUs = async (payload) => {
  const checkIsExist = await AboutUs.findOne();

  if (checkIsExist) {
    const result = await AboutUs.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "About Us updated",
      result,
    };
  } else {
    return await AboutUs.create(payload);
  }
};

const getAboutUs = async () => {
  return await AboutUs.findOne();
};

const deleteAboutUs = async (query) => {
  const { id } = query;

  const result = await AboutUs.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "About Us not found");

  return result;
};

const addFaq = async (payload) => {
  validateFields(payload, ["question", "answer"]);

  return await FAQ.create(payload);
};

const getFaq = async () => {
  return await FAQ.find({});
};

const deleteFaq = async (query) => {
  const { id } = query;

  validateFields(query, ["id"]);

  const result = await FAQ.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "FAQ not found");

  return result;
};

const addContactUs = async (payload) => {
  const checkIsExist = await ContactUs.findOne();

  if (checkIsExist) {
    const result = await ContactUs.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Contact Us updated",
      result,
    };
  } else {
    return await ContactUs.create(payload);
  }
};

const getContactUs = async () => {
  return await ContactUs.findOne({});
};

const deleteContactUs = async (query) => {
  const { id } = query;

  const result = await ContactUs.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "Contact Us not found");

  return result;
};

const addHostGuidelines = async (payload) => {
  const checkIsExist = await HostGuidelines.findOne();

  if (checkIsExist) {
    const result = await HostGuidelines.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Host Guidelines updated",
      result,
    };
  } else {
    return await HostGuidelines.create(payload);
  }
};

const getHostGuidelines = async () => {
  return await HostGuidelines.findOne({});
};

const deleteHostGuidelines = async (query) => {
  const { id } = query;

  const result = await HostGuidelines.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "Host Guidelines not found");

  return result;
};

const addTipsTricks = async (payload) => {
  const checkIsExist = await TipsTricks.findOne();

  if (checkIsExist) {
    const result = await TipsTricks.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Tips Tricks updated",
      result,
    };
  } else {
    return await TipsTricks.create(payload);
  }
};

const getTipsTricks = async () => {
  return await TipsTricks.findOne({});
};

const deleteTipsTricks = async (query) => {
  const { id } = query;

  const result = await TipsTricks.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "Tips Tricks not found");

  return result;
};

const addTrustSafety = async (payload) => {
  const checkIsExist = await TrustSafety.findOne();

  if (checkIsExist) {
    const result = await TrustSafety.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Trust Safety updated",
      result,
    };
  } else {
    return await TrustSafety.create(payload);
  }
};

const getTrustSafety = async () => {
  return await TrustSafety.findOne({});
};

const deleteTrustSafety = async (query) => {
  const { id } = query;

  const result = await TrustSafety.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "Trust Safety not found");

  return result;
};

const ManageService = {
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
  addHostGuidelines,
  getHostGuidelines,
  deleteHostGuidelines,
  addTipsTricks,
  getTipsTricks,
  deleteTipsTricks,
  addTrustSafety,
  getTrustSafety,
  deleteTrustSafety,
};

module.exports = ManageService;
