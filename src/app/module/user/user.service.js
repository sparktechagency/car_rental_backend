const { status } = require("http-status");

const ApiError = require("../../../error/ApiError");
const User = require("./user.model");
const Auth = require("../auth/auth.model");

const updateProfile = async (req) => {
  const { files, body: data } = req || {};
  const { userId, authId } = req.user;

  const getFilePath = (file) => (file && file[0]?.path) || "";

  const updatedData = {
    ...data,
    profile_image: getFilePath(files?.profile_image),
    licenseFrontImage: getFilePath(files?.licenseFrontImage),
    licenseBackImage: getFilePath(files?.licenseBackImage),
  };

  for (let key in updatedData) {
    if (!updatedData[key]) delete updatedData[key];
  }

  const [auth, user] = await Promise.all([
    Auth.findByIdAndUpdate(
      authId,
      { name: updatedData.name },
      {
        new: true,
      }
    ),
    User.findByIdAndUpdate(
      userId,
      {
        $set: updatedData,
      },
      {
        new: true,
      }
    ).populate("authId"),
  ]);

  if (!auth || !user) throw new ApiError(status.NOT_FOUND, "User not found!");

  return user;
};

const getProfile = async (userData) => {
  const { userId, authId } = userData;

  const [auth, result] = await Promise.all([
    Auth.findById(authId),
    User.findById(userId).populate("authId"),
  ]);

  if (!result || !auth) throw new ApiError(status.NOT_FOUND, "User not found");
  if (auth.isBlocked)
    throw new ApiError(status.FORBIDDEN, "You are blocked. Contact support");

  return result;
};

const deleteMyAccount = async (payload) => {
  const { email, password } = payload;

  const isUserExist = await Auth.isAuthExist(email);
  if (!isUserExist) throw new ApiError(status.NOT_FOUND, "User does not exist");
  if (
    isUserExist.password &&
    !(await Auth.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(status.FORBIDDEN, "Password is incorrect");
  }

  Promise.all([
    Auth.deleteOne({ email }),
    User.deleteOne({ authId: isUserExist._id }),
  ]);
};

const UserService = {
  getProfile,
  deleteMyAccount,
  updateProfile,
};

module.exports = { UserService };
