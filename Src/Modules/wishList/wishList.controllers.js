import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import productModel from "../../../Models/product.Model.js";
import wishListModel from "../../../Models/wishList.Models.js";
//================================================
////!=========  createWishList   =============

export const createWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  //=================
  const product = await productModel.findOne({ _id: productId });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  //=================
  const wishListExist = await wishListModel.findOne({ user: req.user._id });
  if (!wishListExist) {
    const wishList = await wishListModel.create({
      user: req.user._id,
      products: [productId],
    });
    return res.status(200).json({ msg: "success", data: wishList });
  }
  //=================
  const wishList = await wishListModel.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { products: productId } }, // Ensure the product is added only once
    { new: true }
  );
  //================
  return res
    .status(200)
    .json({ msg: "wishList added successfully", wishList: wishList });
});
//================================================
////!=========  removeWishList   =============
export const removeWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  //=================
  const product = await productModel.findOne({ _id: productId });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  //=================
  const wishList = await wishListModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: productId } }, // Ensure the product is added only once
    { new: true }
  );
  //================
  return res
    .status(200)
    .json({ msg: "wishList removed successfully", wishList: wishList });
});
