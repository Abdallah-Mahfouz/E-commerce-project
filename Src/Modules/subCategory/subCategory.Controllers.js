import subCategoryModel from "../../../Models/subCategoryModel.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import categoryModel from "../../../Models/category.Models.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

//================================================
////!=========  createSubCategory   =============

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  const categoryExist = await categoryModel.findById(req.params.categoryId);
  if (!categoryExist) {
    return next(new AppError("category not found", 404));
  }
  const subCategoryExist = await subCategoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (subCategoryExist) {
    return next(new AppError("subCategory already exist", 409));
  }

  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `EcommerceC42/categories/${categoryExist.customId}/subCategories/${customId}`,
    }
  );

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name, { replacement: "_", lower: true }),
    Image: { secure_url, public_id },
    customId,
    category: req.params.categoryId,
    createdBy: userId,
  });

  return res.status(201).json({ msg: "success", data: subCategory });
});
//================================================
////!=========  getSubCategory   =============

export const getAllSubCategory = asyncHandler(async (req, res, next) => {
  // const subCategory = await subCategoryModel.find().populate([
  //   {
  //     path: "category",
  //     select: "name -_id",
  //   },
  //   {
  //     path: "createdBy",
  //     select: "name -_id",
  //   },
  // ]);

  // return res.status(200).json({ msg: "success", data: subCategory });
  const apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
    .pagination()
    .filter()
    .search()
    .select()
    .sort();

  const products = await apiFeatures.query;
  return res
    .status(200)
    .json({ msg: "done", page: apiFeatures.page, data: products });
});
//================================================
////!=========  getSubCategory   =============
export const getSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.id).populate([
    {
      path: "category",
      select: "name -_id",
    },
    {
      path: "createdBy",
      select: "name -_id",
    },
  ]);

  if (!subCategory) {
    return next(new AppError("Subcategory not found", 404));
  }

  return res.status(200).json({ msg: "success", data: subCategory });
});
//================================================
////!=========  updateSubCategory   =============
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;
  const { name } = req.body;

  const subCategoryExist = await subCategoryModel.findById(subCategoryId);
  if (!subCategoryExist) {
    return next(new AppError("subCategory not found", 404));
  }

  if (name) {
    subCategoryExist.name = name;
    subCategoryExist.slug = slugify(name, { replacement: "_", lower: true });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(subCategoryExist.Image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `EcommerceC42/categories/${subCategoryExist.category.customId}/subCategories/${subCategoryExist.customId}`,
      }
    );
    subCategoryExist.Image = { secure_url, public_id };
  }

  await subCategoryExist.save();

  return res.status(200).json({ msg: "success", data: subCategoryExist });
});
//================================================
////!=========  deleteSubCategory   =============
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;

  const subCategoryExist = await subCategoryModel.findById(subCategoryId);
  if (!subCategoryExist) {
    return next(new AppError("subCategory not found", 404));
  }

  // Delete image from cloudinary
  await cloudinary.uploader.destroy(subCategoryExist.Image.public_id);

  await subCategoryModel.deleteOne({ _id: subCategoryId });

  return res.status(200).json({ msg: "success", data: subCategoryExist });
});
