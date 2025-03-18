const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db"); // Assuming you have a separate db.js for your MySQL connection
require("dotenv").config();

const app = express();
const port = 8080;
const managerSECRET_KEY = process.env.JWT_SECRET_MANAGER;
const employeeSECRET_KEY = process.env.JWT_SECRET_EMPLOYEE;

// Change for production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT token

// **User Signup**
app.post("/signup", async (req, res) => {
    const { name, email, mobile, password, role, securityKey } = req.body;
    console.log(req.body);
    try {
        
      const [existingUser] = await db.query(
        "SELECT * FROM people WHERE email = ?",
        [email]
      );
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        "INSERT INTO people (name, email, mobile, password, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, mobile, hashedPassword, role]
      );

      if (role === "manager") {

        const [manager] = await db.query("SELECT * FROM people WHERE email = ?", [email]);
        await db.query("INSERT INTO manager_details (manager_id,security_key) VALUES (?, ?)", [manager[0].id, securityKey]);

      }else  if (role === "employee") {

        const [employee] = await db.query("SELECT * FROM people WHERE email = ?", [email]);
        await db.query("INSERT INTO employee_details (employee_id, security_key) VALUES (?, ?)", [employee[0].id, securityKey]);
      }
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "Server error. Try again later." });
    }
  });
  
  // **User Login**
  app.post("/login", async (req, res) => {
    const { role, email, password ,securityKey  } = req.body;
    try {

        if(role === "manager" ) {
            const [manager] = await db.query("SELECT * FROM people WHERE email = ?", [email]);
            const managerKey = await db.query("SELECT security_key FROM managers WHERE manager_id = ?", [manager[0].id]);

            if (securityKey !== managerKey) {
                return res.status(401).json({ message: "You cannot signup as Manager!" });
            }
        }
        else if(role === "employee") {
            const [employee] = await db.query("SELECT * FROM people WHERE email = ?", [email]);
            const employeeKey = await db.query("SELECT security_key FROM employee WHERE employee_id = ?", [employee[0].id]);

            if (securityKey !== employeeKey) {
                return res.status(401).json({ message: "You cannot signup as Employee!" });
            }
        }

      const [user] = await db.query("SELECT * FROM people WHERE email = ?", [email]);

      if (user.length === 0) {
        return res.status(401).json({ message: "Email does not exist" });
      }
      
      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
        return res.status(401).json({ message: "Incorrect Password,Try again" });
      }
  
    //   const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, {
    //     expiresIn: "1h",
    //   });
      res.status(200).json({ message: "Login successful", user: user[0] });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error. Try again later." });
    }
  });

// Fetch all services
app.get("/services", (req, res) => {
    const sql = "SELECT * FROM services";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

// Add a new service
app.post("/services", (req, res) => {
    const { name, price, description, manager_id } = req.body;
    console.log(req.body);
    const sql = "INSERT INTO services (service_name, price, description, manager_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, price, description, manager_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Service added successfully!", id: result.insertId });
        }
    });
});

// Update a service
app.put("/services/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, description, manager_id } = req.body;
    const sql = "UPDATE services SET service_name=?, price=?, description=?, manager_id=? WHERE service_id=?";
    db.query(sql, [name, price, description, manager_id, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Service updated successfully!" });
        }
    });
});

// Delete a service
app.delete("/services/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM services WHERE service_id=?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Service deleted successfully!" });
        }
    });
});

// **Fetch Reviews**
app.get("/reviews", async (req, res) => {
  try {
    const [reviews] = await db.query(
      "SELECT people.name AS user_name, reviews.rating, reviews.comment FROM reviews JOIN people ON reviews.user_id = people.id ORDER BY reviews.created_at DESC" );
    
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
