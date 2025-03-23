const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

router.post("/", async (req, res) => {
    
    const {userId, ownerName, carNumber, contactNumber, serviceDate, serviceTime, selectedServices } = req.body;

    try {
        const [result] = await db.query(
            "INSERT INTO bookings (user_id, user_name, car_number, contact_number, booking_date, booking_time) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, ownerName, carNumber, contactNumber, serviceDate, serviceTime]
        );

        const bookingId = result.insertId;

        const serviceInsertPromises = selectedServices.map(serviceId =>
            db.query("INSERT INTO booking_services (booking_id, service_id) VALUES (?, ?)", [bookingId, serviceId])
        );

        await Promise.all(serviceInsertPromises);

        res.status(201).json({ message: "Booking created successfully!", bookingId });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});





module.exports = router;
