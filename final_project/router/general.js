const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios'); // Import Axios for async operations

const public_users = express.Router();

// Task 10: Get the list of books available in the shop (with async/await)
public_users.get('/', async (req, res) => {
  try {
    // Using async/await for retrieving all books
    const allBooks = Object.values(books); // Convert books object to array
    res.status(200).json(allBooks);  // Return all books
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN (with Promises)
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ message: error }));
});

// Task 12: Get book details based on Author (with async/await)
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    // Using async/await to filter books by author
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      throw new Error("No books found for this author");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Task 13: Get book details based on Title (with Promises)
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  })
  .then(books => res.status(200).json(books))
  .catch(error => res.status(404).json({ message: error }));
});

// Review-related routes
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
