const multer = require("multer");
const fs = require("fs");

const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = "";

      if (file.fieldname === "profile_image") {
        uploadPath = "uploads/images/profile";
      } else if (file.fieldname === "car_image") {
        uploadPath = "uploads/images/car";
      } else if (file.fieldname === "destination_image") {
        uploadPath = "uploads/images/destination";
      } else if (file.fieldname === "licenseFrontImage") {
        uploadPath = "uploads/images/licenseImage";
      } else if (file.fieldname === "licenseBackImage") {
        uploadPath = "uploads/images/licenseImage";
      } else if (file.fieldname === "hostLicenseFrontImage") {
        uploadPath = "uploads/images/licenseImage";
      } else if (file.fieldname === "hostLicenseBackImage") {
        uploadPath = "uploads/images/licenseImage";
      } else {
        uploadPath = "uploads";
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
      ) {
        cb(null, uploadPath);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
    filename: function (req, file, cb) {
      const name = Date.now() + "-" + file.originalname;
      cb(null, name);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedFieldnames = [
      "profile_image",
      "car_image",
      "destination_image",
      "licenseFrontImage",
      "licenseBackImage",
      "hostLicenseFrontImage",
      "hostLicenseBackImage",
    ];

    if (file.fieldname === undefined) {
      // Allow requests without any files
      cb(null, true);
    } else if (allowedFieldnames.includes(file.fieldname)) {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    } else {
      cb(new Error("Invalid fieldname"));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: "profile_image", maxCount: 1 },
    { name: "car_image", maxCount: 15 },
    { name: "destination_image", maxCount: 1 },
    { name: "licenseFrontImage", maxCount: 1 },
    { name: "licenseBackImage", maxCount: 1 },
    { name: "hostLicenseFrontImage", maxCount: 1 },
    { name: "hostLicenseBackImage", maxCount: 1 },
  ]);

  return upload;
};

module.exports = { uploadFile };
