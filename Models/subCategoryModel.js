import mongoose from "mongoose";
//================================================

const subCategorySchema = new mongoose.Schema(
  {
    name: {
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
      maxLength: 30,
      trim: true,
      unique: true,
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
    Image: {
      secure_url: String,
      public_id: String,
    },
    customId: String,
  },
  {
    timestamps: true,
    versionKey: false,
    // toJSON: {
    //   virtuals: true,
    // },
  }
);
//================================================

// subCategorySchema.virtual("products", {
//   ref: "Product",
//   localField: "_id",
//   foreignField: "subCategory",
// });
//================================================

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

export default subCategoryModel;
