import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.model.js";
export const connectDB = () => {
    mongoose
        .connect(process.env.DB_URI, { dbName: "Ecommerce_24" })
        .then((c) => console.log(`Database connected to ${c.connection.host}`))
        .catch((e) => console.log(`Error while connection database : ${e}`));
};
export const invalidateCache = async ({ product, order, admin, userId, orderId, productId, couponCode, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "categories",
            "all-products",
            `product-${productId}`,
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        myCache.del(orderKeys);
    }
    if (couponCode) {
        const couponKeys = [`all-coupons`];
        myCache.del(couponKeys);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percentage = ((thisMonth - lastMonth) / lastMonth) * 100;
    return Number(percentage.toFixed(0));
};
export const getInventories = async ({ categories, productsCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, idx) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[idx] / productsCount) * 100),
        });
    });
    return categoryCount;
};
