const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const PORT = 5000;

// Import route handlers
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

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

// Public users router (for Task 1 & 2)
const public_users = express.Router();

// Route to get the list of all books (Task 1)
public_users.get("/", (req, res) => {
    const books = require('./booksdb');  // Import books data from booksdb.js
    return res.status(200).json({ books: JSON.stringify(books, null, 2) });
});

// Route to get book details based on ISBN (Task 2)
public_users.get('/isbn/:isbn', (req, res) => {
    const books = require('./booksdb');  // Import books data
    const { isbn } = req.params;  // Get the ISBN from the request parameters

    // Find the book with the matching ISBN
    const book = books.find(b => b.isbn === isbn);

    if (book) {
        return res.status(200).json(book);  // Return the book details as JSON
    } else {
        return res.status(404).json({ message: "Book not found" });  // Return 404 if book not found
    }
});

// Route to get books by author (Task 3)
public_users.get('/author/:author', (req, res) => {
    const books = require('./booksdb');  // Import books data
    const author = req.params.author;  // Get the author name from the request parameters
    let booksByAuthor = [];

  
