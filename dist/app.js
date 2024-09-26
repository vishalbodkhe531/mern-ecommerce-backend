import express from "express";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./utils/features.js";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import productRoutes from "./routes/product.routes.js";
import NodeCache from "node-cache";
("node-cache");
// Load environment variables from .env file
config({
    path: "./.env",
});
// Connect to the database
connectDB();
export const myCache = new NodeCache(); /// data store in RAM memory
const app = express(); // Initialize the express application
// Middleware to parse incoming JSON requests
app.use(express.json());
// Basic route to check server status
app.get("/", (req, res, next) => {
    res.send("hello");
});
// Route for user-related API endpoints
app.use("/api/v1/user", userRoutes);
// Route for product-related API endpoints
app.use("/api/v1/product", productRoutes);
// we have declare as a static.. therfore any one can access this folder data
app.use("/uploads", express.static("uploads"));
// Error handling middleware (placed after all routes)
app.use(errorMiddleware);
// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
