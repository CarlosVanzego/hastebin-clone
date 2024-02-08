// Importing required modules
const express = require("express");
const app = express(); // Creating an Express application
app.set("view engine", "ejs"); // Setting view engine to EJS for rendering dynamic content
app.use(express.static("public")); // Serving static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

// Importing the Document model and mongoose for MongoDB interaction
const Document = require("./models/Document");
const mongoose = require("mongoose");
// Connecting to the MongoDB database named 'wastebin'
mongoose.connect("mongodb://localhost/wastebin", {
  // useUnifiedTopology: true, // Optional MongoDB connection options
  // useNewUrlParser: true,
});

// Handling GET request to the root URL
app.get("/", (req, res) => {
  // Default message to display when accessing the root URL
  const code = `Welcome to WasteBin!\n\nUse the commands in the top right corner to create a new file to share with others.`;
  // Rendering the 'code-display' view with the provided code and language
  res.render("code-display", { code, language: "plaintext" });
});

// Handling GET request to '/new' URL
app.get("/new", (req, res) => {
  // Rendering the 'new' view for creating a new document
  res.render("new");
});

// Handling POST request to '/save' URL for saving a document
app.post("/save", async (req, res) => {
  const value = req.body.value; // Extracting the value from the request body
  try {
    // Creating a new document in the database with the provided value
    const document = await Document.create({ value });
    // Redirecting to the URL of the newly created document
    res.redirect(`/${document.id}`);
  } catch (e) {
    // Rendering the 'new' view with the provided value in case of an error
    res.render("new", { value });
  }
});

// Handling GET request to '/:id/duplicate' URL for duplicating a document
app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id; // Extracting the document ID from the URL parameters
  try {
    // Finding the document by its ID in the database
    const document = await Document.findById(id);
    // Rendering the 'new' view with the value of the found document for duplication
    res.render("new", { value: document.value });
  } catch (e) {
    // Redirecting to the original document if duplication fails
    res.redirect(`/${id}`);
  }
});

// Handling GET request to '/:id' URL for accessing a document by its ID
app.get("/:id", async (req, res) => {
  const id = req.params.id; // Extracting the document ID from the URL parameters
  try {
    // Finding the document by its ID in the database
    const document = await Document.findById(id);
    // Rendering the 'code-display' view with the code of the found document and its ID
    res.render("code-display", { code: document.value, id });
  } catch (e) {
    // Redirecting to the root URL if document retrieval fails
    res.redirect("/");
  }
});

// Starting the Express server on port 3000
app.listen(3000);