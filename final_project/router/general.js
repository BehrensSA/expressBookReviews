const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
        const username = req.body.username;
        const password = req.body.password;
      
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    } else if (!username){
        return res.status(404).json({message: "User must have a username."});
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingAuthors = [];
    for (const [key, value] of Object.entries(books)) {
        if (value.author == author) {
            matchingAuthors.push(value);
        }
    };
    return res.send(matchingAuthors);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingTitle = [];
    for (const [key, value] of Object.entries(books)) {
        if (value.title == title) {
            matchingTitle.push(value);
        }
    };
    return res.send(matchingTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
