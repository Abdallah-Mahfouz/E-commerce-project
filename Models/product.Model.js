import mongoose from "mongoose";
//================================================

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide name"],
      minLength: 3,
      maxLength: 30,
      lowercase: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      minLength: 3,
      maxLength: 60,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      minLength: 3,
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },

    coverImages: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    customId: String,
    price: {
      type: Number,
      required: [true, "Please provide price"],
      min: 1,
    },
    discount: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    subPrice: {
      type: Number,
      min: 1,
    },
    stock: {
      type: Number,
      default: 1,
      required: [true, "Please provide stock"],
    },
    rateAvg: {
      type: Number,
      default: 0,
    },
    rateNum: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
//================================================

const productModel = mongoose.model("Product", productSchema);

export default productModel;
