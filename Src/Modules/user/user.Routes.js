import express from "express";
import * as UC from "../user/user.controllers.js";
import { auth } from "../../middleware/auth.js";
import * as UV from "../../validation/user.validation.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
//================================================

const userRouter = express.Router();

//================================================

userRouter.post("/signUp", validation(UV.signUpValidation), UC.signUp);
userRouter.post("/signIn", validation(UV.signInValidation), UC.signIn);
userRouter.get("/verifyEmail/:token", UC.verifyEmail);
userRouter.get("/refreshToken/:rftoken", UC.refreshToken);
userRouter.put(
  "/sendCode",
  validation(UV.forgotPasswordValidation),
  UC.forgetPassword
);

userRouter.put(
  "/resetPassword",
  validation(UV.resetPasswordValidation),
  UC.resetPassword
);

userRouter.get(
  "/",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.getAllUserValidation),
  UC.getAllUsers
);
userRouter.get(
  "/:id",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.getUserValidation),
  UC.getUser
);
userRouter.put(
  "/:id",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.deleteUserValidation),
  UC.updateUser
);
userRouter.delete(
  "/:id",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.deleteUserValidation),
  UC.deleteUser
);

export default userRouter;
