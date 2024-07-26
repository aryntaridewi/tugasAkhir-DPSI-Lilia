const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config(); // To use environment variables

// Register
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.create({ username, password, role });
    res.status(201).json({ pesan: "User berhasil didaftarkan", user });
  } catch (error) {
    res.status(400).json({ pesan: "Pendaftaran gagal", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(403)
        .json({ pesan: "Login gagal: Kredensial tidak valid" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ pesan: "Login berhasil", token });
  } catch (error) {
    res.status(500).json({ pesan: "Login gagal", error: error.message });
  }
});

module.exports = router;
