import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import brandModel from "../../../Models/brand.Models.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

//================================================
////!=========  createBrand   =============

export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  const brandExist = await brandModel.findOne({ name: name.toLowerCase() });
  if (brandExist) {
    return next(new AppError("brand already exist", 409));
  }

  if (!req.file) {
    return next(new AppError("Image not found", 400));
  }

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `EcommerceC42/Brands/${customId}`,
    }
  );
  const brand = await brandModel.create({
    name,
    slug: slugify(name, { replacement: "_", lower: true }),
    Image: { secure_url, public_id },
    customId,
    createdBy: userId,
  });
  res.status(201).json({ msg: "brand created successfully", brand });
});
//================================================
////!=========  getAllBrands   =============

export const getAllBrands = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .pagination()
    .filter()
    .search()
    .select()
    .sort();

  const brand = await apiFeatures.query;
  return res
    .status(200)
    .json({ msg: "done", page: apiFeatures.page, data: brand });
});

//================================================
////!=========  getBrand   =============

export const getBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel
    .findById(req.params.id)
    .populate("createdBy", "name -_id");
  if (!brand) {
    return next(new AppError("Brand not found", 404));
  }
  res.status(200).json({ msg: "success", data: brand });
});

//================================================
////!=========  updateBrand   =============

export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const brandId = req.params.id;

  const brandExist = await brandModel.findById(brandId);
  if (!brandExist) {
    return next(new AppError("Brand not found", 404));
  }

  if (name) {
    brandExist.name = name.toLowerCase();
    brandExist.slug = slugify(name, { replacement: "_", lower: true });
  }

  if (req.file) {
    // Delete old image from cloudinary
    await cloudinary.uploader.destroy(brandExist.Image.public_id);

    // Upload new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `EcommerceC42/Brands/${brandExist.customId}`,
      }
    );

    brandExist.Image = { secure_url, public_id };
  }
  await brandExist.save();

  res.status(200).json({ msg: "Brand updated successfully", data: brandExist });
});
//================================================
////!=========  deleteBrand   =============

export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.params.id;

  const brandExist = await brandModel.findById(brandId);
  if (!brandExist) {
    return next(new AppError("Brand not found", 404));
  }

  // Delete image from cloudinary
  await cloudinary.uploader.destroy(brandExist.Image.public_id);

  await brandModel.deleteOne({ _id: brandId });

  res.status(200).json({ msg: "Brand deleted successfully", data: brandExist });
});
