const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());  // Allow frontend requests
app.use(express.json()); // Parse JSON request bodies

// ✅ MySQL Connection Setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Your MySQL username
    password: "Family_240828", // Replace with your actual password
    database: "coffee_orders" // Make sure this database exists
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});

// ✅ Create Orders Table (Run Once)
db.query(`
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        product VARCHAR(255) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err, result) => {
    if (err) console.error("❌ Table Creation Error:", err);
    else console.log("✅ Orders Table Ready");
});

// ✅ API to Submit an Order
app.post("/api/orders", (req, res) => {
    const { name, product, paymentMethod } = req.body;

    if (!name || !product || !paymentMethod) {
        return res.status(400).json({ message: "⚠️ All fields are required!" });
    }

    const sql = "INSERT INTO orders (name, product, payment_method) VALUES (?, ?, ?)";
    db.query(sql, [name, product, paymentMethod], (err, result) => {
        if (err) {
            console.error("❌ MySQL Insert Error:", err);
            return res.status(500).json({ message: "⚠️ Server Error! Try again." });
        }
        res.json({ message: "✅ Order placed successfully!" });
    });
});

// ✅ API to Fetch Orders for Incharge Login
app.get("/api/orders", (req, res) => {
    db.query("SELECT * FROM orders ORDER BY order_time DESC", (err, results) => {
        if (err) {
            console.error("❌ MySQL Fetch Error:", err);
            return res.status(500).json({ message: "⚠️ Cannot retrieve orders." });
        }
        res.json(results);
    });
});

// ✅ Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
