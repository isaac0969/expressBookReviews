const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

// Function to check if a username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to authenticate a user
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Authentication middleware (to protect routes)
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token

    if (!token) {
        return res.status(403).json({ message: "Access Denied, No token provided" });
    }

    jwt.verify(token, "secret_key", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user; // Store the decoded user info
        next(); // Proceed to the next middleware or route handler
    });
};

// User login and token generation
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});

// Add a book review (protected route)
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // Extract username from the token

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    res.json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
