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
    getBooks().then((result) => res.send(result));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getBookWithISBN(req.params.isbn).then((result) => res.send(result))
    .catch(err => res.status(404).json({message: "Invalid ISBN."}));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    getBookByAuthor(req.params.author).then((result) => res.send(result))
    .catch(err => res.status(404).json({message: "Author not found."}));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    getBookByTitle(req.params.title).then((result) => res.send(result))
    .catch(err => res.status(404).json({message: "Book not found."}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

function getBooks() {
    return new Promise((resolve,reject) => {
        resolve(JSON.stringify(books, null, 4))
    })
}

function getBookWithISBN(isbn) {
    return new Promise ((resolve, reject) => {
        if (isbn in books) {
        resolve(books[isbn]);
        } else {
            reject();
        }
    })
}

function getBookByAuthor(author) {
    return new Promise ((resolve,reject) => {
        const matchingAuthors = [];
        for (const [key, value] of Object.entries(books)) {
            if (value.author == author) {
                matchingAuthors.push(value);
            }
        };
        if (matchingAuthors.length >= 1) {
            resolve(matchingAuthors);
        } else {
            reject()
        }
    })
}

function getBookByTitle(title) {
    return new Promise ((resolve,reject) => {
        const matchingTitle = [];
        for (const [key, value] of Object.entries(books)) {
            if (value.title == title) {
                matchingTitle.push(value);
            }
        };
        if (matchingTitle.length >= 1) {
            resolve(matchingTitle);
        } else {
            reject()
        }
    })
}

module.exports.general = public_users;
