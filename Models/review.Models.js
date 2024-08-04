import mongoose from "mongoose";
//================================================

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please provide name"],
      minLength: 3,
      trim: true,
    },
    rate: {
      type: Number,
      required: [true, "Please provide name"],
      min: 1,
      max: 5,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
//================================================

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
