import dotenv from "dotenv";
dotenv.config();
import userModel from "../../Models/user.Models.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
//================================================
export const auth = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return res.status(404).json({ msg: "token is not exist" });
    }

    if (!token.startsWith(process.env.BEARER_KEY)) {
      return res.status(404).json({ msg: "invalid token format" });
    }

    const newToken = token.split(process.env.BEARER_KEY)[1];
    if (!newToken) {
      return res.status(404).json({ msg: "token not found" });
    }

    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);
    if (!decoded?.email) {
      return res.status(404).json({ msg: "invalid payload" });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    // Authorization check
    if (!roles.includes(user.role)) {
      return next(new AppError("You do not have permission", 401));
    }
    if (parseInt(user.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
      return res
        .status(403)
        .json({ msg: "token is expired please login again" });
    }
    req.user = user;
    next();
  });
};
