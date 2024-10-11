import express from "express";
import { connectDB } from "./utils/features.js";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import NodeCache from "node-cache";
import Stripe from "stripe";

// importing Routes
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
("node-cache");

import morgan from "morgan";
import paymentRoutes from "./routes/payment.routes.js";
import dashboardRoutes from "./routes/statestics.routes.js";

// Load environment variables from .env file
config({
  path: "./.env",
});

// Connect to the database
connectDB();

export const stripe = new Stripe((process.env.STRIPE_KEY as string) || "");

export const myCache = new NodeCache(); /// data store in RAM memory

const app = express(); // Initialize the express application

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(morgan("dev")); // It gives information about the api

// Basic route to check server status
app.get("/", (req, res, next) => {
  res.send("hello");
});

app.use("/api/v1/user", userRoutes); // Route for user-related API endpoints
app.use("/api/v1/product", productRoutes); // Route for product-related API endpoints
app.use("/api/v1/orders", orderRoutes); // Route for orders-related API endpoints
app.use("/api/v1/payment", paymentRoutes); // Route for payment-related API endpoints
app.use("/api/v1/dashboard", dashboardRoutes); // Route for dashboard-related API endpoints

// we have declare as a static.. therfore any one can access this folder data
app.use("/uploads", express.static("uploads"));

// Error handling middleware (placed after all routes)
app.use(errorMiddleware);

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
