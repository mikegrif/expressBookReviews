const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
//let users = [];

const doesExist = (username) => {
  let new_users = users.filter((user) => {
    return user.username === username;
  });

  if (new_users.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post('/register', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: 'User successfully registed' });
    } else {
      return res.status(404).json({ message: 'User already exists!' });
    }
  }
  return res.status(404).json({ message: 'Unable to register user' });
});

// Task 1: Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books, null, 4));
// });

// Task 10: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return new Promise((resolve, reject) => {
    if (Object.keys(books).length > 0) {
      resolve(res.send(JSON.stringify(books, null, 4)));
    } else {
      reject(res.status(404).json({ message: 'Did not find any books' }));
    }
  });
});

// Task 2: Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   //Write your code here
//   let isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(res.send(books[isbn]));
    } else {
      reject(res.status(404).json({ message: 'Did not find book' }));
    }
  });
});

// Task 12: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author;
  return new Promise((resolve, reject) => {
    for (const id in books) {
      const book = books[id];
      if (author === book.author) {
        resolve(res.send(book));
      }
    }
    reject(res.status(404).json({ message: 'Did not find book for author ' }));
  });
});

// Task 4: Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   //Write your code here
//   let title = req.params.title;
//   for (const id in books) {
//     const book = books[id];
//     if (title === book.title) {
//       res.send(book);
//     }
//   }
//   return res.status(404).json({ message: 'Did not find book for title ' });
// });

// Task 11: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  return new Promise((resolve, reject) => {
    for (const id in books) {
      const book = books[id];
      if (title === book.title) {
        resolve(res.send(book));
      }
    }
    reject(res.status(404).json({ message: 'Did not find book for title ' }));
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  console.log('ISBN=', isbn);
  let book = books[isbn];
  console.log('BoOK=', book);
  if (book) {
    res.send(book['reviews']);
  }
  return res.status(404).json({ message: 'Did not find book' });
});

module.exports.general = public_users;
