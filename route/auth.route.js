import express from "express";
import bcrypt from "bcrypt";
import userModel from "../models/UserModel.js";
import passport from "passport";

const auth = express.Router();

// LOGIN
auth.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    if (!user)
      return res.status(400).json({
        success: false,
        message: info?.message || "Invalid credentials",
      });

    req.logIn(user, (err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      return res.json({ success: true, message: "Logged in", user });
    });
  })(req, res, next);
});

// REGISTER
auth.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const findUser = await userModel.findOne({ email });
    if (findUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.json({
      success: true,
      message: "Registered successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// SESSION USER
auth.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  }

  return res.json({ authenticated: false, user: null });
});

// LOGOUT
auth.post("/logout", (req, res) => {
  if (!req.user)
    return res.status(401).json({ success: false, message: "Not logged in" });

  req.logOut((err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });

    return res.status(200).json({ success: true });
  });
});

export default auth;
