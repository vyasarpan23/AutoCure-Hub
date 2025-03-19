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
            const [managerKey] = await db.query("SELECT * FROM manager_details WHERE manager_id = ?", [manager[0].id]);
           

            if (securityKey !== managerKey[0].security_key) {
                return res.status(401).json({ message: "You cannot signup as Manager!" });
            }
        }
        else if(role === "employee") {
            const [employee] = await db.query("SELECT * FROM people WHERE email = ?", [email]);
            const [employeeKey] = await db.query("SELECT security_key FROM employee_details WHERE employee_id = ?", [employee[0].id]);

            if (securityKey !== employeeKey[0].security_key) {
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
app.get("/services", async (req, res) => {
    try {
      const [services] = await db.query("SELECT * FROM services");
  
      if (services.length === 0) {
        return res.status(404).json({ message: "No services found" });
      }
      res.json(services);
    } catch (err) {
      console.error("Error fetching services:", err);
      res.status(500).json({ message: "Error fetching services", error: err.message });
    }
  });
  
  // Add a new service
  app.post("/services", async (req, res) => {
    const { name, price, description, manager_id } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO services (service_name, price, description, manager_id) VALUES (?, ?, ?, ?)",
        [name, price, description, manager_id]
      );
      res.status(201).json({ message: "Service added successfully!", id: result.insertId });
    } catch (err) {
      console.error("Error adding service:", err);
      res.status(500).json({ message: "Error adding service", error: err.message });
    }
  });
  
  // Update a service
  app.put("/services/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, description, manager_id } = req.body;
    try {
      const [result] = await db.query(
        "UPDATE services SET service_name=?, price=?, description=?, manager_id=? WHERE service_id=?",
        [name, price, description, manager_id, id]
      );
      res.json({ message: "Service updated successfully!" });
    } catch (err) {
      console.error("Error updating service:", err);
      res.status(500).json({ message: "Error updating service", error: err.message });
    }
  });
  
  // Delete a service
  app.delete("/services/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM services WHERE service_id=?", [id]);
      res.json({ message: "Service deleted successfully!" });
    } catch (err) {
      console.error("Error deleting service:", err);
      res.status(500).json({ message: "Error deleting service", error: err.message });
    }
  });
  
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
