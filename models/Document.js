// Importing mongoose module for MongoDB interaction
const mongoose = require("mongoose");

// Defining a schema for the Document model
const documentSchema = new mongoose.Schema({
  // Value field to store the document content
  value: {
    type: String, // Value should be a string
    required: true, // Value is required
  },
});

// Exporting the Document model using the defined schema
module.exports = mongoose.model("Document", documentSchema);