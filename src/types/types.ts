import { Request, Response, NextFunction } from "express";

export interface newUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface newProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export type controllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type searchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface baseQuery {
  name?: {
    $regex: string;
    $options: string;
  };

  price?: { $lte: number };

  category?: string;
}
