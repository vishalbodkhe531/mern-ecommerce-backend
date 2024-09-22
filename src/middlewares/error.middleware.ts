import { Request, Response, NextFunction } from "express";
import errorHandler from "../types/utility-class.js";
import { controllerType } from "../types/types.js";

export const errorMiddleware = (
  err: errorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal server error";
  err.statusCode ||= 500;

  return res
    .status(err.statusCode)
    .json({ success: false, message: err.message });
};

export const TryCatch =
  (func: controllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
