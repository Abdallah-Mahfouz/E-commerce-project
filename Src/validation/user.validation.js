import Joi from "joi";
import generalFields from "../utils/generalFields.js";
//================================================
//!=========  signUp   =============
export const signUpValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.password.required(),
    phone: Joi.string().required(),
    address: Joi.array().required(),
    age: Joi.number().required(),
    role: Joi.string(),
  }),
};

//================================================
//!=========  signIn   =============
export const signInValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};
//================================================
//!=========  updateUser   =============
export const updateUserValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(30),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.password,
    phone: Joi.string(),
    address: Joi.string(),
    age: Joi.string(),
    role: Joi.string(),
  }),
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//================================================
//!=========  deleteUser   =============
export const deleteUserValidation = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};

//================================================
//!=========  getAllUser   =============
export const getAllUserValidation = {
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  getUser   =============
export const getUserValidation = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  headers: generalFields.headers.required().unknown(true),
};
//================================================
//!=========  forgotPassword   =============
export const forgotPasswordValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
  }),
}
//================================================
//!=========  resetPassword   =============
export const resetPasswordValidation = {
  body: Joi.object({
    password: generalFields.password.required(),
    code: Joi.string().required(),
    cPassword: generalFields.password.required(),
  }),
}