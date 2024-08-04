import reviewModel from "../../../Models/review.Models.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import productModel from "../../../Models/product.Model.js";
import orderModel from "../../../Models/order.Models.js";

//================================================
////!=========  createReview   =============
export const createReview = asyncHandler(async (req, res, next) => {
  const { comment, rate } = req.body;
  const { productId } = req.params; // Corrected extraction
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  //=================
  const reviewExist = await reviewModel.findOne({
    createdBy: req.user._id,
    productId,
  });
  if (reviewExist) {
    return next(new AppError("You already reviewed this product", 400));
  }

  //=================
  //check if order exists
  const order = await orderModel.findOne({
    user: req.user._id,
    "products.productId": productId,
    status: "delivered",
  });
  if (!order) {
    return next(new AppError("You can't review this product", 400));
  }
  //=================
  const review = await reviewModel.create({
    comment,
    rate,
    createdBy: req.user._id,
    productId,
  });

  //   const reviews = await reviewModel.find({ productId });
  //   let sum = 0;
  //   for (let review of reviews) {
  //     sum += review.rate;
  //   }
  //   product.rating = sum / reviews.length;

  let sum = product.rateAvg * product.rateNum;
  sum = sum + rate;
  product.rateAvg = sum / (product.rateNum + 1);
  product.rateNum += 1;

  await product.save();

  return res.status(200).json({ msg: "success", data: { review } });
});

//================================================
////!=========  deleteReview   =============
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await reviewModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });
  if (!review) {
    return next(new AppError("Review not found", 404));
  }
  //=================
  const product = await productModel.findById(review.productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  //=================
  let sum = product.rateAvg * product.rateNum;
  sum = sum - review.rate;
  product.rateAvg = sum / (product.rateNum - 1);
  product.rateNum -= 1;
  //=================
  await product.save();
  return res.status(200).json({ msg: "success", data: review });
});

//================================================
