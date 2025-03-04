const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// User registration (yet to be implemented)
public_users.post("/register", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
