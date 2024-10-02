import { User } from "../models/user.model.js";
import errorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.middleware.js";

export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new errorHandler("You should login first !!", 401));

  const user = await User.findById(id);
  if (!user) return next(new errorHandler("User not found !!", 404));

  if (user.role !== "admin")
    return next(new errorHandler("Invalide role !!", 403));

  next();
});
