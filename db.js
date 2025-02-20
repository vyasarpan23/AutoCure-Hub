const mysql = require('mysql2');

// Database Connection
const db = mysql.createConnection({
    host: 'localhost', // Change if using a remote server
    user: 'root', // Your MySQL username
    password: 'Apsingh@2301', // Your MySQL password
    database: 'user_database'
}).promise();

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database.');
});

module.exports = db;
