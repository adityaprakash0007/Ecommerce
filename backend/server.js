import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'

dotenv.config({ quiet: true });
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://ecommerce-kappa-livid-19.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/orders', orderRoute);

app.get("/", (req, res) => {
  res.status(200).send("Ecommerce backend is running!");
});

app.listen(PORT, ()=>{
    console.log(`app is listening on ${PORT}`)
});