const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Using db.js for MySQL connection
require("dotenv").config();

const app = express();
const port = 8080;
const SECRET_KEY = process.env.JWT_SECRET || "Adarsh@23"; // Change for production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    next();
  });
};

// **User Signup**
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existingUser] = await db
      
      .query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      
      .query("INSERT INTO Users (name, email, password) VALUES (?, ?, ?)", [
        name,
        email,
        hashedPassword,
      ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// **User Login with JWT**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db
      
      .query("SELECT * FROM Users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found! You need to sign up first" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// **Fetch User Profile (Protected Route)**
app.get("/profile", authenticateUser, async (req, res) => {
  try {
    const [users] = await db
      
      .query("SELECT id, name, email FROM Users WHERE id = ?", [req.userId]);
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
    const [users] = await db
      
      .query("SELECT * FROM Users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      
      .query("UPDATE Users SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// **Fetch Reviews**
// **Fetch Reviews**
app.get("/reviews", async (req, res) => {
  try {
    // Execute query and get the results
    let query = "SELECT users.name, Reviews.rating, Reviews.comment FROM Reviews JOIN users ON Reviews.user_id = users.id ORDER BY Reviews.created_at DESC";
    // let reviews = await db.execute(query);
    //  reviews = reviews._rows;
    const reviews = await db.execute(query);
    
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }
    // Make sure to check if the result is an array
    if (!Array.isArray(reviews)) {
      throw new Error("Expected an array of reviews.");
    }

    res.json(reviews[0]); // Send the array as response
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
});

// **Submit a Review (Authenticated)**
app.post("/submit-review", async (req, res) => {
  const {userId, rating, comment } = req.body;
  try {
    await db.execute(
      "INSERT INTO Reviews (user_id, rating, comment) VALUES (?, ?, ?)",
      [userId, rating, comment]
    );
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting review" });
    console.log(err);
  }
});

// **Start Server**
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
