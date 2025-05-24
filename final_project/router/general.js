const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * Task 1: Get the list of all books (async/await)
 */
public_users.get('/', async (req, res) => {
  try {
    const allBooks = books;  // keep object structure, not array
    res.status(200).send(JSON.stringify(allBooks, null, 4)); // Formatted JSON
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * Task 2: Get book details based on ISBN (Promises)
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    book ? resolve(book) : reject("Book not found");
  })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ message: error }));
});

/**
 * Task 3: Get book details based on Author (async/await)
 */
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
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

/**
 * Task 4: Get book details based on Title (Promises)
 */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
    booksByTitle.length > 0 ? resolve(booksByTitle) : reject("No books found with this title");
  })
  .then(books => res.status(200).json(books))
  .catch(error => res.status(404).json({ message: error }));
});

/**
 * Task 5: Get book review by ISBN
 */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
