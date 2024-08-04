import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import couponModel from "../../../Models/coupon.Models.js";

//================================================
////!=========  createCoupon   =============
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;
  const userId = req.user.id;

  const couponExist = await couponModel.findOne({ code: code.toLowerCase() });
  if (couponExist) {
    return next(new AppError("coupon already exist", 409));
  }

  const coupon = await couponModel.create({
    code,
    amount,
    fromDate,
    toDate,
    createdBy: userId,
  });
  res.status(201).json({ msg: "success", coupon });
});
//================================================
////!=========  getCoupon   =============

export const getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.id);
  if (!coupon) {
    return next(new AppError("coupon not found", 404));
  }
  res.status(200).json({ msg: "success", coupon });
});

//================================================
////!=========  getAllCoupons   =============
export const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find();
  res.status(200).json({ msg: "success", coupons });
});

//================================================
////!=========  updateCoupon   =============

export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { code, amount, fromDate, toDate } = req.body;

  const coupon = await couponModel.findOneAndUpdate(
    { _id: id, createdBy: req.user.id },
    {
      code,
      amount,
      fromDate,
      toDate,
    },
    {
      new: true,
    }
  );
  if (!coupon) {
    return next(
      new AppError("coupon not  exist or you are not authorized", 404)
    );
  }
  res.status(200).json({ msg: "success", coupon });
});

//================================================
////!=========  deleteCoupon   =============
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return next(new AppError("coupon not found", 404));
  }
  res.status(200).json({ msg: "success", coupon });
});
