import cartModel from "../../../Models/cart.Models.js";
import productModel from "../../../Models/product.Model.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";

//================================================
////!=========  createCart   =============
export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  //=================
  //check product exists
  const product = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(new AppError("Product not found or out of stock", 404));
  }
  //=================
  //check if cart exists
  const cartExist = await cartModel.findOne({ user: req.user._id });
  if (!cartExist) {
    const cart = await cartModel.create({
      user: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });
    return res.status(201).json({ data: cart });
  }
  //=================
  //check if product in cart
  //quantity update
  let flag = false;

  for (const product of cartExist.products) {
    if (product.productId == productId) {
      product.quantity = quantity;
      flag = true;
      break;
    }
  }
  if (!flag) {
    cartExist.products.push({ productId, quantity });
  }
  await cartExist.save();
  return res.status(200).json({ msg: "done", data: cartExist });
});

//================================================
////!=========  getCart   =============
export const getCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel
    .findOne({ user: req.user._id })
    .populate("products.productId", "title price discount");
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  return res.status(200).json({ data: cart });
});

//================================================
////!=========  removeCart   =============
export const removeCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    { $pull: { products: { productId } } },
    { new: true }
  );
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  return res.status(200).json({ data: cart });
});

//================================================
////!=========  clearCart   =============
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $set: { products: [] } },
    { new: true }
  );
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  return res.status(200).json({ data: cart });
});
