const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const Favorite = require("./favorite.model");
const QueryBuilder = require("../../../builder/queryBuilder");
const validateFields = require("../../../util/validateFields");
const Car = require("../car/car.model");

const addRemoveFavorite = async (userData, query) => {
  const { userId } = userData;
  const { carId } = query;
  const favoriteData = { user: userId, car: carId };

  validateFields(query, ["carId"]);

  const [car, existingFavorite] = await Promise.all([
    Car.findById(carId),
    Favorite.findOne({ user: userId, car: carId }),
  ]);

  if (!car) throw new ApiError(status.NOT_FOUND, "car not found");

  if (existingFavorite) {
    const result = await Favorite.deleteOne({
      user: userId,
      car: carId,
    });

    return {
      message: "Favorite Removed",
      result,
    };
  }

  return await Favorite.create(favoriteData);
};

const getMyFavorite = async (userData, query) => {
  const { userId } = userData;

  const favoriteQuery = new QueryBuilder(
    Favorite.find({ user: userId }).populate([{ path: "car" }]),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await favoriteQuery.modelQuery;
  const meta = await favoriteQuery.countTotal();

  if (!result.length)
    throw new ApiError(status.NOT_FOUND, "Favorite not found");

  return {
    meta,
    result,
  };
};

const FavoriteService = {
  addRemoveFavorite,
  getMyFavorite,
};

module.exports = { FavoriteService };
