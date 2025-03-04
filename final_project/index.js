const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

// Import route handlers
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Session configuration
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// JWT Authentication Middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers.authorization; // Get token from request header

    if (!token) {
        return res.status(403).json({ message: "Access denied, no token provided" });
    }

    jwt.verify(token.split(' ')[1], "secret_key", (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user; // Attach user info to request
        next(); // Continue to next middleware
    });
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
