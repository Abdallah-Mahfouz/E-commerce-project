import mongoose from "mongoose";
//================================================

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        title: {
          type: String,
          required: true,
        },
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    supPrice: {
      type: Number,
      required: true,
    },
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "cash"],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "placed",
        "waitPayment",
        "delivered",
        "cancelled",
        "onWay",
        "rejected",
      ],
      default: "placed",
    },
    canceledBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    // cancelledByAdmin:{
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    //   default: null
    // },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
//================================================

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
