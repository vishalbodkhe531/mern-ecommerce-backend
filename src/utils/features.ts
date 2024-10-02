import mongoose from "mongoose";
import { invalidateCacheProps, orderItemTypes } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

export const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI as string, { dbName: "Ecommerce_24" })
    .then((c) => console.log(`Database connected to ${c.connection.host}`))
    .catch((e) => console.log(`Error while connection database : ${e}`));
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
  couponCode,
}: invalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
      `product-${productId}`,
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`product-${i}`));

    myCache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(orderKeys);
  }

  if (couponCode) {
    const couponKeys: string[] = [`all-coupons`];
    myCache.del(couponKeys);
  }
};

export const reduceStock = async (orderItems: orderItemTypes[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};
