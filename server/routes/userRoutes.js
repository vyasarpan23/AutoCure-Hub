const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

// **User Signup**
router.post("/signup", async (req, res) => {
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
  router.post("/login", async (req, res) => {
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

  

module.exports = router;
