import express from "express"
import connectdb from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js"
import cardRoute from "./routes/cardRoute.js"
import collectionRoute from "./routes/collectionRoute.js";
import reviewRoute from "./routes/reviewRoute.js"
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;
console.log(process.env.JWT_SECRET);
const app=express()

app.use(cors());
app.use(express.json());
connectdb();
app.use("/api/users", userRoutes);
app.use("/api/users", productRoute);
app.use("/api/users"  ,collectionRoute);
app.use("/api/users", cardRoute);
app.use("/api/users" ,reviewRoute)

app.listen(port,()=>console.log(`app is listining on ${port} port`))
