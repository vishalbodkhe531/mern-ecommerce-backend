import { TryCatch } from "../middlewares/error.middleware.js";
import { Request, Response, NextFunction } from "express";
import { newOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.model.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import errorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  const key = `my-orders-${user}`;

  let orders = [];

  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find({ user });
    myCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({ success: true, orders });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = `all-orders`;

  let orders = [];

  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find().populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({ success: true, orders });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const key = `order-${id}`;

  let order;

  if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) return next(new errorHandler("Order not found", 404));

    myCache.set(key, JSON.stringify(order));
  }

  return res.status(200).json({ success: true, order });
});

export const newOrder = TryCatch(
  async (
    req: Request<{}, {}, newOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      user,
      tax,
      subTotle,
      shippingCharges,
      discount,
      total,
      orderItems,
    } = req.body;

    if (
      !shippingInfo ||
      !user ||
      !tax ||
      !subTotle ||
      !shippingCharges ||
      !total ||
      !orderItems
    )
      return next(new errorHandler("Please enter all the fields", 400));

    const order = await Order.create({
      shippingInfo,
      user,
      tax,
      subTotle,
      shippingCharges,
      discount,
      total,
      orderItems,
    });

    reduceStock(orderItems);

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res
      .status(201)
      .json({ success: true, message: "Order place successfully" });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new errorHandler("Order not found !!", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;

    case "Shipped":
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order.user),
  });

  return res
    .status(200)
    .json({ success: true, message: "Order procssed successfully" });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);

  if (!order) return next(new errorHandler("Order not found !!", 404));

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res
    .status(200)
    .json({ success: true, message: "Order deleted successfully" });
});
