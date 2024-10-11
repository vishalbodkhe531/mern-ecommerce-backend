import { myCache, stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { Coupon } from "../models/coupon.model.js";
import { invalidateCache } from "../utils/features.js";
import errorHandler from "../utils/utility-class.js";
export const newPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount)
        return next(new errorHandler("Please enter amount", 400));
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
    });
    return res
        .status(200)
        .json({ success: true, clientSecreat: paymentIntent.client_secret });
});
export const newCoupon = TryCatch(async (req, res, next) => {
    const { code, amount } = req.body;
    if (!code || !amount)
        return next(new errorHandler("Please enter both coupon and amount", 400));
    await Coupon.create({ code, amount });
    await invalidateCache({ couponCode: true });
    return res
        .status(201)
        .json({ success: true, message: `Coupon ${code} created successfully` });
});
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    if (!coupon)
        return next(new errorHandler("Please enter coupon-code", 400));
    const discount = await Coupon.findOne({ code: coupon });
    if (!discount)
        return next(new errorHandler("Invalide coupon code", 400));
    return res.status(200).json({ success: true, discount: discount.amount });
});
export const allCoupons = TryCatch(async (req, res, next) => {
    // const coupons = await Coupon.find({});
    let coupons;
    const key = `all-coupons`;
    if (myCache.has(key))
        coupons = JSON.parse(myCache.get(key));
    else {
        coupons = await Coupon.find({});
        myCache.set(key, JSON.stringify(coupons));
    }
    return res.status(200).json({ success: true, coupons });
});
export const deleteCoupons = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new errorHandler("Invalide coupon Id", 400));
    await invalidateCache({ couponCode: true });
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon?.code} deleted successfully`,
    });
});
