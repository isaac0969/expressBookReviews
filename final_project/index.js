const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// Import route handlers
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

// Middleware: Parse incoming JSON requests
app.use(express.json());

// Session Middleware: Configuration for session handling
app.use(
    "/customer",
    session({
        secret: "fingerprint_customer", // Secret key for signing session ID cookie
        resave: true,
        saveUninitialized: true,
    })
);

// JWT Authentication Middleware for protected routes
app.use("/customer/auth/*", (req, res, next) => {
    const authHeader = req.headers.authorization; // Extract token from Authorization header

    if (!authHeader) {
        return res.status(403).json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(' ')[1]; // Extract actual token

    jwt.verify(token, "secret_key", (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user; // Attach user information to request
        next(); // Continue to next middleware or route handler
    });
});

// Routes for authenticated users and general users
app.use("/customer", customer_routes); // Customer routes
app.use("/", genl_routes); // General routes

// Public users router (for Task 5 & 6)
const public_users = express.Router();
app.use("/", public_users);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
