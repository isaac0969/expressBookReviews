const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// User registration (yet to be implemented)
public_users.post("/register", (req, res) => {
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Book-related routes
// Get the book list available in the shop
public_users.get('/', (req, res) => {
  const allBooks = [];
  for (let isbn in books) {
    allBooks.push(books[isbn]);
  }
  return res.status(200).json(allBooks);  // Return all books
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);  // Return book details if found
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = [];

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: `No books found by author ${author}` });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = [];

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle.push(books[isbn]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: `No books found with title ${title}` });
  }
});

// Review-related routes
// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);  // Return the reviews for the book
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
