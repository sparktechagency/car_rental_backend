const { FavoriteService } = require("./favorite.service");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");

const addRemoveFavorite = catchAsync(async (req, res) => {
  const result = await FavoriteService.addRemoveFavorite(req.user, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message ? result.message : "Favorite added",
    data: result.result ? result.result : result,
  });
});

const getMyFavorite = catchAsync(async (req, res) => {
  const result = await FavoriteService.getMyFavorite(req.user, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Favorite retrieved",
    data: result,
  });
});

const FavoriteController = {
  addRemoveFavorite,
  getMyFavorite,
};

module.exports = { FavoriteController };
