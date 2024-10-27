import { User } from "../models/user.model.js";
import errorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.middleware.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user)
        return res
            .status(200)
            .json({ success: true, message: `Welcome ${user.name}` });
    if (!name || !email || !photo || !gender || !_id || !dob)
        return next(new errorHandler("Please add all the feilds", 400));
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res
        .status(201)
        .json({ success: true, message: `Welcome ${user.name}` });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const user = await User.find({});
    return res.status(200).json({ success: true, user });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new errorHandler("Invlide ID", 400));
    return res.status(200).json({ success: true, user });
});
export const delelteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user)
        return next(new errorHandler("Invlide ID", 400));
    return res
        .status(200)
        .json({ success: true, message: "User successfully deleted" });
});
