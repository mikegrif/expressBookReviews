const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let select_users = users.filter((user) => {
    return user.username === username;
  });

  if (select_users.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validuser = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validuser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  console.log(`Username=${username} and Password=${password}`);

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res.status(208).json({ message: 'Invalid login. Check username/password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  console.log(`Enter add review: username=${username}`);

  if (!username) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  let book = books[isbn];
  if (book) {
    let review = req.body.review;
    let reviewer = req.session.authorization['username'];

    if (review) {
      book.reviews[reviewer] = review;
      books[isbn] = book;
      res.send('Book review successfully updated');
    }
  }
  res.send('Unable to update book review');
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  if (!username) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: 'Invalid user' });
  }

  let book = books[isbn];
  if (book) {
    let reviews = book.reviews;
    if (reviews[username]) {
      delete reviews[username];
    }
    books[isbn] = book;
    res.send('Book review successfully deleted');
  }
  res.send('Did not delete review for book');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
