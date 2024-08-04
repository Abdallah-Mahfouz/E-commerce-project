import mongoose from "mongoose";
//================================================

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
//================================================

const wishListModel = mongoose.model("WishList", wishListSchema);

export default wishListModel;
