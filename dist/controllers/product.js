import { TryCatch } from "../middlewares/error.middleware.js";
import { Product } from "../models/product.model.js";
import errorHandler from "../types/utility-class.js";
import { rm } from "fs";
// import { faker } from "@faker-js/faker";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo) {
        return res
            .status(400)
            .json({ success: false, message: "Photo is required" });
    }
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log(`deleted photo URI`);
        });
        return next(new errorHandler("Please enter all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res
        .status(201)
        .json({ success: true, message: "Product created successfully" });
});
export const getLatestProducts = TryCatch(async (req, res, next) => {
    const product = await Product.find({}).sort({ createdAt: -1 }).limit(5); // 1 = asc... -1 = des...
    return res.status(200).json({ success: true, product });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({ success: true, categories });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const product = await Product.find({});
    return res.status(200).json({ success: true, product });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    return res.status(200).json({ success: true, product });
});
export const updateProducts = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new errorHandler("Invalid product ID", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log(`old photo deleted`);
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(200).json({ message: "Product updated successfully" });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new errorHandler("Product not found", 404));
    rm(product.photo, () => {
        console.log("Product photo deleted");
    });
    await Product.deleteOne();
    return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
});
export const getAllSearchProduct = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search, // it find specific pattern
            $options: "i", // for case sencitive
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price), // less than or quele to [ex:: 1000(price) <= 4000(actual value)];
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    // it's work's  parallry
    const [products, filterProductOnly] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const totlePage = Math.ceil(filterProductOnly.length / limit); /// here limit = 4 and product arr = 8 then it display totle 2 page
    return res.status(200).json({ success: true, products, totlePage });
});
/// this function generate random products
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\5ba9bd91-b89c-40c2-bb8a-66703408f986.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ succecss: true });
// };
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ succecss: true });
// };
// generateRandomProducts(40); here pass product how many you wan't and import faker;
// it delete random produts
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ succecss: true });
// };
// deleteRandomsProducts(38);
