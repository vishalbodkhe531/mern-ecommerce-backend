import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { calculatePercentage } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};
  const key = `admin-stats`;
  if (myCache.has(key)) stats = JSON.parse(myCache.get(key));
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1), // this month starting date
      end: today, // this month ending date
    };
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1), // last month starting date
      end: new Date(today.getFullYear(), today.getMonth(), 0), // last month ending date
    };
    const thisMonthProductPromise = await Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthProductPromise = await Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthUserPromise = await User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthUserPromise = await User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthOrderPromise = await Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthOrderPromise = await Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const lastSixMonthOrderPromise = await Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });
    const latestTransationPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);
    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUsersCount,
      latestTransation,
    ] = await Promise.all([
      thisMonthProductPromise,
      thisMonthUserPromise,
      thisMonthOrderPromise,
      lastMonthProductPromise,
      lastMonthUserPromise,
      lastMonthOrderPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransationPromise,
    ]);
    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };
    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const count = {
      revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };
    const orderMonthCount = new Array(6).fill(0); // here we created array that length is 6
    const orderMonthyRevenue = new Array(6).fill(0); //and first element is 0
    lastSixMonthOrders.forEach((order) => {
      const creationData = order.createdAt;
      const monthDiff = today.getMonth() - creationData.getMonth();
      if (monthDiff < 6) {
        orderMonthCount[6 - monthDiff - 1] += 1;
        orderMonthyRevenue[6 - monthDiff - 1] += order.total;
      }
    });
    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, idx) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[idx] / productsCount) * 100),
      });
    });
    const UserRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };
    const modiefyLatestTransation = latestTransation.map((item) => ({
      _id: item._id,
      discount: item.discount,
      amount: item.total,
      quantity: item.orderItems.length,
      status: item.status,
    }));
    stats = {
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthCount,
        revanue: orderMonthyRevenue,
      },
      UserRatio,
      latestTransation: modiefyLatestTransation,
    };
    myCache.set(key, JSON.stringify(stats));
  }
  return res.status(200).json({ success: true, stats });
});
export const getPieCharts = TryCatch(async (req, res, next) => {});
export const getBarCharts = TryCatch(async (req, res, next) => {});
export const getLineCharts = TryCatch(async (req, res, next) => {});
