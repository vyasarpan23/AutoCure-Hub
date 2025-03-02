const mysql = require('mysql2');

// Create a MySQL connection pool (for better connection management)
const pool = mysql.createPool({
    host: 'localhost', // Change if using a remote server
    user: 'root', // Your MySQL username
    password: 'Apsingh@2301', // Your MySQL password
    database: 'autocure_hub',
    waitForConnections: true,  // Ensures that the pool waits for connections if the limit is reached
    connectionLimit: 10,      // Maximum number of connections in the pool
    queueLimit: 0             // No queue limit
});

// Create a promise-based interface for the connection pool
const db = pool.promise();

// Connect and check connection status
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database.');
    connection.release();  // Release the connection back to the pool
});

module.exports = db;
