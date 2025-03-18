const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Assuming you have a separate db.js for your MySQL connection
require("dotenv").config();

const app = express();
const port = 8080;
const SECRET_KEY = process.env.JWT_SECRET; // Change for production

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
app.post("/user-signup", async (req, res) => {
  const { name, email, mobile, password } = req.body;
 console.log(req.body);
  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [name, email, mobile, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// **User Login with JWT**
app.post("/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      user_email,
    ]);
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found! You need to sign up first" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(user_password, user.password);
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

// **Manager Signup**
app.post("/manager-signup", async (req, res) => {
  const { name, email, mobile, password, securityKey } = req.body;
 if(securityKey !== SECRET_KEY) {
  return res.status(400).json({ message: "Invalid security key\n Please select the correct role" });
}

  try {
    const [existingManager] = await db.query(
      "SELECT * FROM managers WHERE email = ?",
      [email]
    );
    if (existingManager.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO managers (name, email, mobile, password, security_key) VALUES (?, ?, ?, ?, ?)",
      [name, email, mobile, hashedPassword, securityKey]
    );

    res.status(201).json({ message: "Manager registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// **Manager Login
app.post("/manager-login", async (req, res) => {
  const { managerId, password ,securityKey} = req.body;
  
  if(securityKey !== SECRET_KEY) {
    return res.status(400).json({ message: "Invalid security key\n Please select the correct role" });
  }

  try {
    const [managers] = await db.query("SELECT * FROM managers WHERE manager_id = ?", [
      managerId,
    ]);
    if (managers.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found! You need to sign up first" });
    }

    const manager = managers[0];
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      manager: { id: manager.id, name: manager.name, email: manager.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// **Employee Signup**
app.post("/employee-signup", async (req, res) => {
  const { name, email, mobile, password } = req.body;
  console.log(req.body);
  try {
    const [existingEmployee] = await db.query(
      "SELECT * FROM employees WHERE email = ?",
      [email]
    );
    if (existingEmployee.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO employees (name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [name, email, mobile, hashedPassword]
    );

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// **Employee Login 
app.post("/employee-login", async (req, res) => {
  const { employee_id, employeePassword } = req.body;
  
  try {
    const [employees] = await db.query("SELECT * FROM employees WHERE employee_id = ?", [
      employee_id,
    ]);
    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found! You need to sign up first" });
    }

    const employee = employees[0];
    const isMatch = await bcrypt.compare(employeePassword, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      employee: { id: employee.id, name: employee.name, email: employee.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// **Fetch Reviews**
app.get("/reviews", async (req, res) => {
  try {
    const [reviews] = await db.query(
      "SELECT users.name AS user_name, reviews.rating, reviews.comment FROM reviews JOIN users ON reviews.user_id = users.id ORDER BY reviews.created_at DESC" );
    
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
});

// **Submit a Review (Authenticated)**
app.post("/submit-review", async (req, res) => {
  const { userId, rating, comment } = req.body;

  try {
    await db.query(
      "INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)",
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
