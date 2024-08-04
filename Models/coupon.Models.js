import mongoose from "mongoose";
//================================================

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please provide name"],
      minLength: 3,
      maxLength: 30,
      lowercase: true,
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide name"],
      min: 1,
      max: 100,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    fromDate: {
      type: Date,
      required: [true, "Please provide fromDate"],
    },
    toDate: {
      type: Date,
      required: [true, "Please provide toDate"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
//================================================

const couponModel = mongoose.model("Coupon", couponSchema);

export default couponModel;
