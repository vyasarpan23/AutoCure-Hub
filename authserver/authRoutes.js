const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const SECRET_KEY = process.env.JWT_SECRET;
const validRoles = ["user", "employee", "manager"];

// Generic Signup API
router.post("/:role-signup", async (req, res) => {
  const { role } = req.params;
  if (!validRoles.includes(role)) return res.status(400).json({ message: "Invalid role specified." });

  const { name, email, mobile, password, security_key } = req.body;
  if (!name || !email || !mobile || !password) return res.status(400).json({ message: "All fields are required." });

  try {
    const [existing] = await db.query(`SELECT * FROM ${role}s WHERE email = ?`, [email]);
    if (existing.length > 0) return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const fields = role === "manager" ? "(name, email, mobile, password, security_key)" : "(name, email, mobile, password)";
    const values = role === "manager" ? [name, email, mobile, hashedPassword, security_key] : [name, email, mobile, hashedPassword];

    await db.query(`INSERT INTO ${role}s ${fields} VALUES (?, ?, ?, ?, ?)`, values);
    res.status(201).json({ message: `${role} registered successfully.` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// Generic Login API
router.post("/:role-login", async (req, res) => {
  const { role } = req.params;
  if (!validRoles.includes(role)) return res.status(400).json({ message: "Invalid role specified." });

  const { email, password } = req.body;
  try {
    const [users] = await db.query(`SELECT * FROM ${role}s WHERE email = ?`, [email]);
    if (users.length === 0) return res.status(404).json({ message: `${role} not found! Please sign up.` });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

module.exports = router;
