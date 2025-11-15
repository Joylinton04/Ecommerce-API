import express from "express";
import bcrypt from "bcrypt";
import userModel from "../models/UserModel.js";
import passport from "passport";
import "../passport.config.js";

const auth = express.Router();

auth.get("/status", (req, res) => {
  const user = req.user;
  const session = req.session;
  return user && session
    ? res.json({ success: true, user, session })
    : res.status(401).json({ success: false });
});

auth.post("/login", passport.authenticate("local"), (req, res) => {
  return res.json({ success: true, message: "Logged In" });
});

auth.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const findUser = await userModel.findOne({ email });
    if (findUser)
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    const user = new userModel(newUser);
    await user.save();
    return res.json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
});

auth.post("/logout", (req, res) => {
  if (!req.user) return res.status(401);
  req.logOut(err => {
    if(err) return res.status(400)
    return res.status(200).json({success: true})
  })
});

export default auth;
