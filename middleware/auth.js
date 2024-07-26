const jwt = require("jsonwebtoken");
require("dotenv").config(); // Menggunakan environment variables dari file .env

// Middleware untuk memverifikasi token JWT
const authenticateToken = (req, res, next) => {
  // Mendapatkan header authorization dan memisahkan token dari string "Bearer [token]"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Jika token tidak ditemukan, mengembalikan status 403 dan pesan error
  if (!token) return res.status(403).json({ message: "Token tidak ditemukan" });

  // Memverifikasi token dengan secret key yang disimpan di environment variables
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Jika verifikasi gagal, mengembalikan status 403 dan pesan error
    if (err) {
      return res
        .status(403)
        .json({ message: "Token tidak valid, Masukkan yang baru!" });
    }
    // Menyimpan informasi user dari token ke dalam request object
    req.user = user;
    next(); // Melanjutkan ke middleware berikutnya
  });
};

// Middleware untuk otorisasi berdasarkan peran (role)
const authorizeRole = (role) => {
  return (req, res, next) => {
    // Mengecek apakah peran user sesuai dengan peran yang diizinkan
    if (req.user.role !== role) {
      // Jika peran tidak sesuai, mengembalikan status 403 dan pesan error
      return res
        .status(403)
        .json({ pesan: "Akses ditolak: Peran tidak valid" });
    }
    next(); // Melanjutkan ke middleware berikutnya
  };
};

// Mengekspor fungsi middleware
module.exports = { authenticateToken, authorizeRole };
