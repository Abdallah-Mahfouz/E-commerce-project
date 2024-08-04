import Joi from "joi";
import mongoose from "mongoose";
//*================================================
const objectIdValidation = (value, helper) => {
  return mongoose.Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ID");
};

//*================================================
export const generalFields = {
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  id: Joi.string().custom(objectIdValidation).required(),
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    fieldname: Joi.string().required(),
  }),
  headers: Joi.object({
    "cache-control": Joi.string().optional(),
    "postman-token": Joi.string().optional(),
    "Content-Type": Joi.string().optional(),
    "Content-Length": Joi.string().optional(),
    host: Joi.string().optional(),
    "user-agent": Joi.string().optional(),
    accept: Joi.string().optional(),
    "accept-encoding": Joi.string().optional(),
    connection: Joi.string().optional(),
    token: Joi.string().required(),
  }).unknown(true), // Allow unknown headers
};

export default generalFields;
