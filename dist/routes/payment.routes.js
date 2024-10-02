import express from "express";
import { allCoupons, applyDiscount, deleteCoupons, newCoupon, } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";
const paymentRoutes = express.Router();
// route /api/v1/payment/discount
paymentRoutes.get("/discount", applyDiscount);
// route /api/v1/payment/coupon/new
paymentRoutes.post("/coupon/new", adminOnly, newCoupon);
// route /api/v1/payment/coupon/all
paymentRoutes.get("/coupon/all", adminOnly, allCoupons);
// route /api/v1/payment/coupon/:id
paymentRoutes.delete("/coupon/:id", adminOnly, deleteCoupons);
export default paymentRoutes;
