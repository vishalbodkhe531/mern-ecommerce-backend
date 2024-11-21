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

export type invalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
  couponCode?: boolean;
};

export type orderItemTypes = {
  name: string;
  price: number;
  photo: string;
  quantity: number;
  productId: string;
  stock?: number;
};

export type shiffingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface newOrderRequestBody {
  shippingInfo: shiffingInfoType;
  user: string;
  tax: number;
  subtotal: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: orderItemTypes[];
}
