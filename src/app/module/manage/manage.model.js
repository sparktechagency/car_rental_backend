const mongoose = require("mongoose");
const { model } = require("mongoose");

const termsAndConditionsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const privacySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const aboutUsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const contactUsSchema = new mongoose.Schema(
  {
    callToUs: {
      type: Array,
    },
    writeToUs: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const tipsTricksSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const trustSafetySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const hostGuidelinesSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  PrivacyPolicy: model("PrivacyPolicy", privacySchema),
  TermsConditions: model("TermsConditions", termsAndConditionsSchema),
  FAQ: model("FAQ", faqSchema),
  AboutUs: model("AboutUs", aboutUsSchema),
  ContactUs: model("ContactUs", contactUsSchema),
  TipsTricks: model("TipsTricks", tipsTricksSchema),
  TrustSafety: model("TrustSafety", trustSafetySchema),
  HostGuidelines: model("HostGuidelines", hostGuidelinesSchema),
};
