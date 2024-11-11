const { Schema, model, Types } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const feedbackSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
    },
  },
  { timestamps: true }
);

const Feedback = model("Feedback", feedbackSchema);

module.exports = Feedback;
