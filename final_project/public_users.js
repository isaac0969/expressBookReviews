const express = require("express");
const public_users = express.Router();
const books = require("./booksdb"); // Adjust path if needed

// Get the list of books
public_users.get("/", function (req, res) {
    return res.status(200).json({ books: JSON.stringify(books, null, 2) });
});

module.exports = public_users;
// Public Users API 
