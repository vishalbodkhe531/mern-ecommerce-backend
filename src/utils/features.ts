import mongoose from "mongoose";
import { invalidateCacheProps, orderItemTypes } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.model.js";

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
}: invalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    const product = await Product.find({}).select("_id");

    product.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });

    myCache.del(productKeys);
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
