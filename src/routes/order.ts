import express from "express";
import { newOrder } from "../controllers/order.js";

const orderRoutes = express.Router();

orderRoutes.post("/new", newOrder);

export default orderRoutes;
