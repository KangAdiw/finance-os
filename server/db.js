// db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Membaca konfigurasi dari file .env
dotenv.config();

// Membuat koneksi "Pool" (Kumpulan koneksi agar lebih efisien)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Cek koneksi
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Gagal konek ke Database:", err.message);
  } else {
    console.log("✅ Berhasil konek ke Database MySQL!");
    connection.release(); // Lepas koneksi setelah dicek
  }
});

module.exports = db.promise(); // Kita export versi promise agar bisa pakai async/await nanti
