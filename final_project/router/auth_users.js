const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = {}; // Use an object instead of an array for quick lookups

// Function to check if a username exists
const isValid = (username) => {
    return users.hasOwnProperty(username);
};

// Function to authenticate a user
const authenticatedUser = (username, password) => {
    return isValid(username) && users[username].password === password;
};

// Middleware to authenticate JWT-protected routes
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token

    if (!token) {
        return res.status(403).json({ message: "Access Denied, No token provided" });
    }

    jwt.verify(token, "secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded; // Store the decoded user info
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

// Add or modify a book review (protected route)
regd_users.post("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // Extract username from the token

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Ensure reviews exist for the book
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    res.json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review (protected route)
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username; // Extract username from token

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found to delete" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    res.json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports = { authenticated: regd_users, isValid, users };
