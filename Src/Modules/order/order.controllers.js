import orderModel from "../../../Models/order.Models.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import couponModel from "../../../Models/coupon.Models.js";
import productModel from "../../../Models/product.Model.js";
import { createInvoice } from "../../utils/pdf.js";
import cartModel from "../../../Models/cart.Models.js";
import { sendEmail } from "../../../services/sendEmail.js";
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";

//================================================
////!=========  createOrder   =============
export const createOrder = asyncHandler(async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } =
    req.body;

  // Check for coupon
  if (couponCode) {
    const coupon = await couponModel.findOne({
      code: couponCode.toLowerCase(),
      usedBy: { $nin: [req.user._id] },
    });

    if (!coupon || coupon.toDate < Date.now()) {
      return next(new AppError("Coupon does not exist or has expired", 404));
    }
    req.body.coupon = coupon;
  }

  // Check product availability
  let products = [];
  let flag = false;

  if (productId) {
    products = [{ productId, quantity }];
  } else {
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      return next(
        new AppError("Cart is empty. Please add some products.", 404)
      );
    }

    products = cart.products; // BSON array
    flag = true;
  }

  // Process products
  let finalProducts = [];
  let subPrice = 0;

  for (let product of products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });

    if (!checkProduct) {
      return next(new AppError("Product not found or out of stock", 404));
    }

    if (flag) {
      product = product.toObject();
    }

    product.title = checkProduct.title;
    product.price = checkProduct.price;
    product.finalPrice = checkProduct.price * product.quantity;
    subPrice += product.finalPrice;

    finalProducts.push(product);
  }

  // Create order
  const order = await orderModel.create({
    user: req.user._id,
    products: finalProducts,
    couponId: req.body.coupon?._id,
    supPrice: subPrice,
    totalPrice: subPrice - subPrice * ((req.body.coupon?.amount || 0) / 100),
    address,
    phone,
    status: paymentMethod === "cash" ? "placed" : "waitPayment",
    paymentMethod,
  });

  // Update coupon usage
  if (req.body.coupon) {
    await couponModel.updateOne(
      { _id: req.body.coupon._id },
      { $push: { usedBy: req.user._id } }
    );
  }

  // Update product stock
  for (let product of finalProducts) {
    await productModel.findByIdAndUpdate(
      { _id: product.productId },
      { $inc: { stock: -product.quantity } }
    );
  }

  // Clear cart if needed
  if (flag) {
    await cartModel.updateOne(
      { user: req.user._id },
      { $set: { products: [] } }
    );
  }

  // ================
  // =================
  const invoice = {
    shipping: {
      name: req.user.name,
      address: req.user.address,
    },
    items: order.products,
    subtotal: subPrice,
    paid: order.totalPrice,
    invoice_nr: order._id,
    date: order.createdAt,
    coupon: req.body?.coupon?.amount || 0,
  };

  await createInvoice(invoice, "invoice.pdf");

  await sendEmail(
    req.user.email,
    " Order Placed",
    `<h1>your order has been placed successfully</h1>`,
    [
      {
        path: "invoice.pdf",
        contentType: "application/pdf",
      },
      {
        path: "logoA.png",
        contentType: "application/pdf",
      },
    ]
  );

  //==================
  if (paymentMethod == "card") {
    // Check if the stripe_secret environment variable is set
    if (!process.env.stripe_secret) {
      return next(new AppError("Stripe secret key is not defined", 500));
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(process.env.stripe_secret);

    if (req.body?.coupon) {
      try {
        const coupon = await stripe.coupons.create({
          percent_off: req.body.coupon.amount,
          duration: "once",
        });
        req.body.couponId = coupon.id;
      } catch (error) {
        return next(new AppError("Failed to create Stripe coupon", 500));
      }
    }

    try {
      const session = await payment({
        stripe,
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: req.user.email,
        metadata: {
          orderId: order._id.toString(),
        },
        success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
        cancel_url: `${req.protocol}://${req.headers.host}/order/cancel/${order._id}`,
        line_items: order.products.map((product) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.title,
              },
              unit_amount: product.price * 100,
            },
            quantity: product.quantity,
          };
        }),
        discounts: req.body?.coupon ? [{ coupon: req.body.couponId }] : [],
      });

      return res
        .status(200)
        .json({ msg: "success", url: session.url, session });
    } catch (error) {
      return next(new AppError("Failed to create Stripe session", 500));
    }
  }
  //==================
  res.status(201).json({ msg: "success", order });
});
//==============================================================================
//------------------------------------------------------------------------------
////!=========  cancelOrder   =============

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findOne({ _id: id, user: req.user._id });
  if (!order) {
    return next(new AppError("order not found", 404));
  }
  //================
  if (
    (order.paymentMethod === "cash" && order.status != "placed") ||
    (order.paymentMethod === "card" && order.status != "waitPayment")
  ) {
    return next(new AppError("You can't cancel this order", 400));
  }
  //================
  await orderModel.updateOne(
    { _id: id },
    { reason, status: "cancelled", cancelledBy: req.user._id }
  );
  //================
  if (order?.couponId) {
    await couponModel.updateOne(
      { _id: order?.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }
  //================
  for (let product of order.products) {
    await productModel.findByIdAndUpdate(
      { _id: product.productId },
      { $inc: { stock: product.quantity } }
    );
  }

  res.status(200).json({ msg: "success", order });
});

//==============================================================================
////!=========  webhook   =============

export const webhook = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.stripe_secret);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Extract the orderId from the event data
  const { orderId } = event.data.object.metadata || {};

  if (!orderId) {
    return res.status(400).json({ msg: "orderId is not defined" });
  }

  // Handle the event
  if (event.type !== "checkout.session.completed") {
    const { orderId } = event.data.object.metadata;
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      {
        status: "rejected",
      }
    );
    return res.status(400).json({ msg: "fail" });
  }
  await orderModel.findOneAndUpdate(
    { _id: orderId },
    {
      status: "placed",
    }
  );
  return res.status(200).json({ msg: "done" });
});
