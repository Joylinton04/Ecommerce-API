import express from "express";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import dotenv from "dotenv";
import cors from "cors";
import productRoute from "./route/product.route.js";
import cartRoute from "./route/cart.route.js";
import orderRoute from "./route/order.route.js";
import passport from "passport";
import session from "express-session";
import auth from "./route/auth.route.js";
import "./passport.config.js";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.mongodb_uri,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();
connectCloudinary();

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.send("API working...");
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).send(message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is Up!!");
});
