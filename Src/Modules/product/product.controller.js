import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import productModel from "../../../Models/product.Model.js";
import categoryModel from "../../../Models/category.Models.js";
import subCategoryModel from "../../../Models/subCategoryModel.js";
import brandModel from "../../../Models/brand.Models.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
//================================================
////!=========  createProduct   =============
export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    subCategory,
    brand,
    price,
    discount,
    stock,
  } = req.body;
  //=================
  const userId = req.user._id;
  //=================
  //check if category exists
  const categoryExist = await categoryModel.findOne({ _id: category });
  if (!categoryExist) {
    return next(new AppError("category not found", 404));
  }
  //=================
  //check if subCategory exists
  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) {
    return next(new AppError("subCategory not found", 404));
  }
  //=================
  //check if brand exists
  const brandExist = await brandModel.findOne({ _id: brand });
  if (!brandExist) {
    return next(new AppError("brand not found", 404));
  }
  //=================
  //check if product with the same title exists
  const productExist = await productModel.findOne({
    title: title.toLowerCase(),
  });
  if (productExist) {
    return next(new AppError("product already exists", 404));
  }
  //=================
  const subPrice = price - (price * (discount || 0)) / 100;
  //=================
  if (!req.files) {
    return next(new AppError("Image is required", 400));
  }
  //=================
  const customId = nanoid(5);
  let list = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `EcommerceC42/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brands/${brandExist.customId}/products/${customId}/coverImages`,
      }
    );
    list.push({ secure_url, public_id });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `EcommerceC42/products/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brands/${brandExist.customId}/products/${customId}/MainImage`,
    }
  );

  const product = await productModel.create({
    title,
    slug: slugify(title, { replacement: "_", lower: true }),
    description,
    category,
    subCategory,
    brand,
    price,
    subPrice,
    discount,
    stock,
    coverImages: list,
    image: { secure_url, public_id },
    createdBy: userId,
  });
  
  return res.status(201).json({ msg: "product created", data: product });
});

//================================================
////!=========  getProduct   =============
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel
    .findById(req.params.id)
    .populate("category")
    .populate("subCategory")
    .populate("brand")
    .populate("createdBy", "name email");
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  return res.status(200).json({ data: product });
});

//================================================
////!=========  getAllProducts   =============
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
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
////!=========  updateProduct   =============

export const updateProduct = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    subCategory,
    brand,
    price,
    discount,
    stock,
  } = req.body;
  //=================
  const { id } = req.params;
  //=================
  //check if category exists
  const categoryExist = await categoryModel.findOne({ _id: category });
  if (!categoryExist) {
    return next(new AppError("category not found", 404));
  }
  //=================
  //check if subCategory exists
  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) {
    return next(new AppError("subCategory not found", 404));
  }
  //=================
  //check if brand exists
  const brandExist = await brandModel.findOne({ _id: brand });
  if (!brandExist) {
    return next(new AppError("brand not found", 404));
  }
  //=================
  //check if product exists
  const product = await productModel.findById({
    _id: id,
    createdBy: req.user._id,
  });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  //=================
  //check if title exists
  if (title) {
    if (title.toLowerCase() == product.title) {
      return next(new AppError(" title matches with old title", 404));
    }
    if (await productModel.findOne({ title: title.toLowerCase() })) {
      return next(new AppError(" title already exists", 404));
    }
    product.title = title.toLowerCase();
    product.slug = slugify(title, { replacement: "_", lower: true });
  }
  //=================
  if (description) {
    product.description = description;
  }
  //=================
  if (stock) {
    product.stock = stock;
  }
  //=================
  if (price & discount) {
    product.subPrice = price - (price * (discount || 0)) / 100;
    product.price = price;
    product.discount = discount;
  } else if (price) {
    product.subPrice = price - (price * (product.discount || 0)) / 100;
    product.price = price;
  } else if (discount) {
    product.subPrice = product.price - (product.price * (discount || 0)) / 100;
    product.discount = discount;
  }

  //check if image exists
  if (req.files) {
    if (req.files?.image?.length) {
      await cloudinary.uploader.destroy(product.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `EcommerceC42/products/${categoryExist.customId}/subCategories
          /${subCategoryExist.customId}/brands/${brandExist.customId}/products/${product.customId}/MainImage`,
        }
      );
      product.image = { secure_url, public_id };
    }
    //=================
    //check if coverImages exists
    if (req.files?.coverImages?.length) {
      for (const file of req.files.coverImages) {
        await cloudinary.api
          .delete_resources_by_prefix(`EcommerceC42/categories/${categoryExist.customId}/subCategories
            /${subCategoryExist.customId}/brands/${brandExist.customId}/products/${product.customId}/coverImages`);
        let list = [];
        for (const file of req.files.coverImages) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            {
              folder: `EcommerceC42/categories/${categoryExist.customId}/subCategories
                  /${subCategoryExist.customId}/brands/${brandExist.customId}/products/${product.customId}/coverImages`,
            }
          );
          list.push({ secure_url, public_id });
        }
        product.coverImages = list;
      }
    }
  }

  await product.save();

  return res.status(200).json({ msg: "Product updated", data: product });
});

//================================================
////!=========  deleteProduct   =============
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  // Optionally delete images from cloudinary
  for (const file of product.coverImages) {
    await cloudinary.uploader.destroy(file.public_id);
  }
  await cloudinary.uploader.destroy(product.image.public_id);

  return res.status(200).json({ msg: "Product deleted" });
});
