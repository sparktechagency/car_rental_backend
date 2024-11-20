const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema(
  {
    sender: {
      type: ObjectId,
      required: true,
    },
    receiver: {
      type: ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

module.exports = Message;
