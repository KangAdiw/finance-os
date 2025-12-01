const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Siapkan konfigurasi dasar
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// LOGIKA PENTING:
// Jika Host-nya mengandung kata "tidbcloud", kita WAJIB pakai SSL
if (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud")) {
  dbConfig.ssl = {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  };
}

// Membuat koneksi Pool
const db = mysql.createPool(dbConfig);

// Cek koneksi
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Gagal konek ke Database:", err.message);
  } else {
    console.log("✅ Berhasil konek ke Database MySQL!");
    connection.release();
  }
});

module.exports = db.promise();
