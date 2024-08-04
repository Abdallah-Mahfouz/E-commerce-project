import categoryModel from "../../../Models/category.Models.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import subCategoryModel from "../../../Models/subCategoryModel.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

//================================================
////!=========  createCategory   =============
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;
  //===================
  const categoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (categoryExist) {
    return next(new AppError("category already exist", 409));
  }
  //===================
  if (!req.file) {
    return next(new AppError("Image not found", 400));
  }
  //===================
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `EcommerceC42/categories/${customId}`,
    }
  );
  req.filePath = `EcommerceC42/categories/${customId}`;
  //===================
  const category = await categoryModel.create({
    name,
    slug: slugify(name, { replacement: "_", lower: true }),
    Image: { secure_url, public_id },
    customId,
    createdBy: userId,
  });

  //===================
  req.data = {
    model: categoryModel,
    id: category.id,
  };
  //===================
  return res.status(200).json({
    msg: "success",
    data: category,
  });
});
//================================================
////!=========  updateCategory   =============
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  //===================
  const category = await categoryModel.findOne({
    _id: id,
    createdBy: userId,
  });

  if (!category) {
    return next(new AppError("category not found", 404));
  }
  //===================
  if (name) {
    if (name.toLowerCase() === category.name) {
      return next(new AppError("name should be different", 409));
    }
    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("category name already exist", 409));
    }
    category.name = name.toLowerCase();
    category.slug = slugify(name, { replacement: "_", lower: true });
  }
  //===================
  if (req.file) {
    await cloudinary.uploader.destroy(category.Image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `EcommerceC42/categories/${category.customId}`,
      }
    );
    category.Image = { secure_url, public_id };
  }
  //===================
  await category.save();
  return res.status(200).json({
    msg: "success",
    data: category,
  });
});
//================================================
////!=========  getCategories   =============
export const getAllCategory = asyncHandler(async (req, res, next) => {
  // //virtual relationship
  // const categories = await categoryModel
  //   .find({})
  //   .populate([{ path: "subCategories" }]);
  // //?=================
  // //normal relationship
  // // const categories = await categoryModel.find();
  // // for (const category of categories) {
  // //   const subCategories = await subCategoryModel
  // //     .find({ category: category._id })
  // //     .populate("category");
  // //   category.subCategories = subCategories;
  // // }
  // return res.status(200).json({
  //   msg: "success",
  //   data: categories,
  // });
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .pagination()
    .filter()
    .search()
    .select()
    .sort();

  const category = await apiFeatures.query;
  return res
    .status(200)
    .json({ msg: "done", page: apiFeatures.page, data: category });
});
//================================================
////!=========  getCategory   =============
export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findOne({ _id: id });
  if (!category) {
    return next(new AppError("category not found", 404));
  }
  return res.status(200).json({
    msg: "success",
    data: category,
  });
});
//================================================
////!=========  deleteCategory   =============
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  //===================
  const category = await categoryModel.findOneAndDelete({
    _id: id,
    createdBy: userId,
  });
  if (!category) {
    return next(new AppError("category not exist or your not authorized", 404));
  }
  //===================
  //delelte all subCategory related to this category
  await subCategoryModel.deleteMany({ category: category._id });
  //===================
  //delete image from cloudinary
  await cloudinary.api.delete_resources_by_prefix(
    `EcommerceC42/categories/${category.customId}`
  );
  //===================
  //delete folder
  await cloudinary.api.delete_folder(
    `EcommerceC42/categories/${category.customId}`
  );
  //===================

  return res.status(200).json({
    msg: "success",
    data: category,
  });
});
