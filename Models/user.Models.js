import mongoose from "mongoose";
import { systemRoles } from "../Src/utils/systemRoles.js";
//================================================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "email must be unique"],
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
    cPassword: {
      type: String,
      required: [true, "confirm password is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    phone: {
      type: String,
    },
    address: {
      type: Array,
    },
    image: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: "user",
    },
    passwordChangedAt: Date,
    code: String,
    
  },
  { timestamps: true, versionKey: false }
);
//================================================

const userModel = mongoose.model("User", userSchema);

export default userModel;
