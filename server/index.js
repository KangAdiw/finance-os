const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Pastikan file db.js sudah ada

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// --- MIDDLEWARE AUTH (SATPAM TOKEN) ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) return res.status(401).json({ error: "Akses Ditolak (Belum Login)" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token Tidak Valid" });
    req.user = user;
    next();
  });
};

// ==========================================
// 1. AUTHENTICATION & USER PROFILE
// ==========================================

// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek email duplikat
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) return res.status(400).json({ error: "Email sudah terdaftar!" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User (Default target_amount = 0)
    await db.query("INSERT INTO users (name, email, password, target_amount) VALUES (?, ?, ?, 0)", [name, email, hashedPassword]);

    res.status(201).json({ message: "Registrasi berhasil! Silakan login." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ error: "Email atau password salah!" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Email atau password salah!" });

    // Buat Token
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login berhasil!",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Profile (Protected)
app.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, target_amount FROM users WHERE id = ?", [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile & Target (Protected)
app.put("/auth/update", authenticateToken, async (req, res) => {
  try {
    const { name, target_amount } = req.body;

    await db.query("UPDATE users SET name = ?, target_amount = ? WHERE id = ?", [name, target_amount, req.user.id]);

    res.json({ message: "Profil berhasil diperbarui!", data: { name, target_amount } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. PEMASUKAN / GAJI (INCOME)
// ==========================================

// Get All Salaries
app.get("/salary", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM salary_logs ORDER BY transaction_date DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Salary (Auto Convert)
app.post("/salary", async (req, res) => {
  try {
    const { amount_usdt, transaction_date, description } = req.body;

    if (!amount_usdt || !transaction_date) {
      return res.status(400).json({ error: "Data tidak lengkap!" });
    }

    // Ambil Rate dari CoinGecko
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr");
    const currentRate = response.data.tether.idr;
    const totalIdr = amount_usdt * currentRate;

    await db.query(`INSERT INTO salary_logs (transaction_date, description, amount_usdt, exchange_rate, amount_idr) VALUES (?, ?, ?, ?, ?)`, [transaction_date, description, amount_usdt, currentRate, totalIdr]);

    res.status(201).json({ message: "Data Berhasil Disimpan!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menyimpan data." });
  }
});

// Update Salary
app.put("/salary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_usdt, transaction_date, description } = req.body;

    // Ambil rate lama agar konsisten
    const [oldData] = await db.query("SELECT exchange_rate FROM salary_logs WHERE id = ?", [id]);
    if (oldData.length === 0) return res.status(404).json({ error: "Data tidak ditemukan" });

    const currentRate = oldData[0].exchange_rate;
    const newTotalIdr = amount_usdt * currentRate;

    await db.query("UPDATE salary_logs SET amount_usdt=?, amount_idr=?, transaction_date=?, description=? WHERE id=?", [amount_usdt, newTotalIdr, transaction_date, description, id]);

    res.json({ message: "Data berhasil diupdate!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Salary
app.delete("/salary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM salary_logs WHERE id = ?", [id]);
    res.json({ message: "Data berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. PENGELUARAN (EXPENSES)
// ==========================================

// Get Expenses
app.get("/expenses", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM expense_logs ORDER BY expense_date DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Expense
app.post("/expenses", async (req, res) => {
  try {
    const { expense_date, category, description, amount_idr } = req.body;

    await db.query("INSERT INTO expense_logs (expense_date, category, description, amount_idr) VALUES (?, ?, ?, ?)", [expense_date, category, description, amount_idr]);

    res.status(201).json({ message: "Pengeluaran berhasil disimpan!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Expense
app.delete("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM expense_logs WHERE id = ?", [id]);
    res.json({ message: "Pengeluaran berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT} 🚀`);
});
