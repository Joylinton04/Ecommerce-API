import express from "express";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import dotenv from "dotenv";
import cors from "cors";
import productRoute from "./route/product.route.js";
import { jwtCheck, verifyAdmin, verifyUser } from "./middleware/auth.middleware.js";
import cartRoute from "./route/cart.route.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
connectCloudinary();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);

app.get("/", (req, res) => {
  res.send("API working...");
});

app.get("/protected", jwtCheck, verifyUser,async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  console.log(accessToken)
  // const user = req.auth[`https://${process.env.AUTH0_DOMAIN}/claims/user`];
  // console.log("Is user?", user);
  // if (!isAdmin) {
  //   return res.status(403).send("Admins only");
  // }rol_3nWV5KwMVFYnXzjv

  res.send("Authorized...");
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
