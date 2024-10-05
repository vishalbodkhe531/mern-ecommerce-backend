import express from "express";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts,
} from "../controllers/statestics.js";
import { adminOnly } from "../middlewares/auth.js";

const dashboardRoutes = express.Router();

// route /api/v1/dashboard/stats
dashboardRoutes.get("/stats", adminOnly, getDashboardStats);

// route /api/v1/dashboard/pie
dashboardRoutes.get("/pie", adminOnly, getPieCharts);

// route /api/v1/dashboard/bar
dashboardRoutes.get("/bar", adminOnly, getBarCharts);

// route /api/v1/dashboard/line
dashboardRoutes.get("/line", adminOnly, getLineCharts);

export default dashboardRoutes;
