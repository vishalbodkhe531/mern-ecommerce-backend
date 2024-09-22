import express from "express";
import { delelteUser, getAllUsers, getUser, newUser, } from "../controllers/user.controller.js";
import { adminOnly } from "../middlewares/auth.js";
const userRoutes = express.Router();
// /api/v1/user/new
userRoutes.post("/new", newUser);
///api/v1/user/all-users
userRoutes.get("/all", adminOnly, getAllUsers);
///api/v1/user/id --> get
///api/v1/user/id --> delete
userRoutes.route("/:id").get(getUser).delete(delelteUser);
export default userRoutes;
