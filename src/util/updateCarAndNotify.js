const Car = require("../app/module/car/car.model");
const postNotification = require("./postNotification");

const updateCarAndNotify = async (
  carId,
  updateData,
  userId,
  message,
  title = null
) => {
  const updatedCar = await Car.findByIdAndUpdate(
    carId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedCar) throw new ApiError(status.NOT_FOUND, "Car not found");

  postNotification(title ? title : "Car Data Updated", message, userId);

  return updatedCar;
};

module.exports = { updateCarAndNotify };
