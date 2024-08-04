import Joi from "joi";
import { generalFields } from "../utils/generalFields.js";
//================================================
//!=========  createProduct   =============
export const createProduct = {
  body: Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string(),
    category: generalFields.id.required(),
    subCategory: generalFields.id.required(),
    brand: generalFields.id.required(),
    price: Joi.number().min(1).integer().required(),
    discount: Joi.number().min(1).max(100),
    stock: Joi.number().min(3).integer().required(),
  }),
  files: Joi.object({
    image: Joi.array().items(generalFields.file.required()).required(),
    coverImages: Joi.array().items(generalFields.file.required()).required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getProduct   =============
export const getProduct = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};
//================================================
//!=========  updateProduct   =============
export const updateProduct = {
  body: Joi.object({
    title: Joi.string().min(3).max(30),
    description: Joi.string(),
    category: generalFields.id.required(),
    subCategory: generalFields.id.required(),
    brand: generalFields.id.required(),
    price: Joi.number().min(1).integer(),
    discount: Joi.number().min(1).max(100),
    stock: Joi.number().min(3).integer(),
  }),
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  files: Joi.object({
    image: Joi.array().items(generalFields.file),
    coverImages: Joi.array().items(generalFields.file),
  }),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  deleteProduct   =============
export const deleteProduct = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
