import { TryCatch } from "../middlewares/error.middleware.js";
import { Order } from "../models/order.model.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import errorHandler from "../utils/utility-class.js";
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, user, tax, subTotle, shippingCharges, discount, total, orderItems, } = req.body;
    if (!shippingInfo ||
        !user ||
        !tax ||
        !subTotle ||
        !shippingCharges ||
        !total ||
        !orderItems)
        return next(new errorHandler("Please enter all the fields", 400));
    await Order.create({
        shippingInfo,
        user,
        tax,
        subTotle,
        shippingCharges,
        discount,
        total,
        orderItems,
    });
    reduceStock(orderItems);
    invalidateCache({ product: true, order: true, admin: true });
    return res
        .status(201)
        .json({ success: true, message: "Order place successfully" });
});
// export const newOrder = TryCatch(
//   async (req: Request<{}, {}, newOrderRequestBody>, res, next) => {
//     const {
//       shippingInfo,
//       user,
//       tax,
//       subTotle,
//       shippingCharges,
//       discount,
//       total,
//       orderItems,
//     } = req.body;
//     // if (!shippingInfo || !orderItems || !user || !subTotle || !tax || !total)
//     //   return next(new errorHandler("Please Enter All Fields", 400));
//     const order = await Order.create({
//       shippingInfo,
//       orderItems,
//       user,
//       subTotle,
//       tax,
//       shippingCharges,
//       discount,
//       total,
//     });
//     await reduceStock(orderItems);
//     await invalidateCache({ product: true, order: true, admin: true });
//     return res.status(201).json({
//       success: true,
//       message: "Order Placed Successfully",
//     });
//   }
// );
