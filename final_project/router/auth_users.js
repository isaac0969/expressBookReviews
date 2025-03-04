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
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

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
