import mongoose from "mongoose";
export const connectDB = () => {
    mongoose
        .connect(process.env.DB_URI, { dbName: "Ecommerce_24" })
        .then((c) => console.log(`Database connected to ${c.connection.host}`))
        .catch((e) => console.log(`Error while connection database : ${e}`));
};
