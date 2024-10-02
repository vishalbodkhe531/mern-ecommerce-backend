import express from "express";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder, } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";
const orderRoutes = express.Router();
// route - /api/v1/order/new
orderRoutes.post("/new", newOrder);
// route - /api/v1/order/my
orderRoutes.get("/my", myOrders);
// route - /api/v1/order/all
orderRoutes.get("/all", adminOnly, allOrders);
// route - /api/v1/order/:id
orderRoutes
    .route("/:id")
    .get(getSingleOrder)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
// route - /api/v1/order/all
// orderRoutes.get("/all", adminOnly, processOrder);
export default orderRoutes;
