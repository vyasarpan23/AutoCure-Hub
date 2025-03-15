const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Assuming you have a separate db.js for your MySQL connection
require("dotenv").config();

const app = express();
const port = 8080;

// **Fetch User Profile (Protected Route)**
app.get("/profile", authenticateUser, async (req, res) => {
    try {
      const [users] = await db.query(
        "SELECT id, name, email FROM users WHERE id = ?",
        [req.userId]
      );
      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(users[0]);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // **Password Reset (Future Feature)**
  app.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE users SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);
  
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  