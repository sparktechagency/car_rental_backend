const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const Review = require("./review.model");
const QueryBuilder = require("../../../builder/queryBuilder");
const postNotification = require("../../../util/postNotification");
const validateFields = require("../../../util/validateFields");
const Car = require("../car/car.model");
const { default: mongoose } = require("mongoose");
const User = require("../user/user.model");

const postReview = async (userData, payload) => {
  const { userId } = userData;
  const { carId } = payload || {};
  const reviewData = {
    user: userId,
    car: carId,
    ...payload,
  };
  const carObjectId = mongoose.Types.ObjectId.createFromHexString(carId);

  validateFields(payload, ["carId", "rating", "review"]);

  const car = await Car.findById(payload.carId).select("user make").lean();
  if (!car) throw new ApiError(status.NOT_FOUND, "Car not found");
  reviewData.host = car.user;

  const result = await Review.create(reviewData);

  const avgCarRatingAgg = await Review.aggregate([
    {
      $match: { car: carObjectId },
    },
    {
      $group: {
        _id: "$car",
        avgRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  const avgHostRatingAgg = await Car.aggregate([
    {
      $match: { user: car.user },
    },
    {
      $group: {
        _id: "$user",
        avgRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  // const [avgCarRatingAgg, avgHostRatingAgg] = await Promise.all([
  //   Review.aggregate([
  //     {
  //       $match: { car: carObjectId },
  //     },
  //     {
  //       $group: {
  //         _id: "$car",
  //         avgRating: {
  //           $avg: "$rating",
  //         },
  //       },
  //     },
  //   ]),
  //   Car.aggregate([
  //     {
  //       $match: { user: car.user },
  //     },
  //     {
  //       $group: {
  //         _id: "$user",
  //         avgRating: {
  //           $avg: "$rating",
  //         },
  //       },
  //     },
  //   ]),
  // ]);

  const avgCarRating = avgCarRatingAgg[0].avgRating.toFixed(2) ?? 0;
  const avgHostRating = avgHostRatingAgg[0].avgRating.toFixed(2) ?? 0;
  console.log(avgCarRating, avgHostRating);

  Promise.all([
    Car.updateOne(
      { _id: carId },
      { rating: avgCarRating },
      { new: true, runValidators: true }
    ),
    User.updateOne(
      { _id: car.user },
      { rating: avgHostRating },
      { new: true, runValidators: true }
    ),
  ]);

  postNotification(
    "New Review Alert",
    `You've received a new ${payload.rating}-star review on your ${car.make}.`,
    car.user
  );

  return result;
};

const getAllReview = async (query) => {
  const { carId, hostId, ...newQuery } = query || {};
  let reviewQuery;
  const queryObj = {};
  let populateObj = {
    path: "user",
    select: "name profile_image address -_id",
  };

  if (carId) queryObj.car = carId;
  // if (hostId) queryObj.host = hostId;

  if (carId) {
    reviewQuery = new QueryBuilder(
      Review.find(queryObj).populate(populateObj),
      newQuery
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();
  } else {
    reviewQuery = new QueryBuilder(
      Review.find({}).populate(populateObj),
      newQuery
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();
  }

  const [result, meta] = await Promise.all([
    reviewQuery.modelQuery,
    reviewQuery.countTotal(),
  ]);

  if (!result.length) throw new ApiError(status.NOT_FOUND, "Review not found");

  return {
    meta,
    result,
  };
};

const ReviewService = {
  postReview,
  getAllReview,
};

module.exports = { ReviewService };
