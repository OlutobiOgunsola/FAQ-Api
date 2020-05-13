'use strict';
// Importing dependencies
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const PhoneBookRouter = require('./router/PhoneBookRouter');

// Initializing the express application instance
const app = express();

// Applying middleware's to express app
app.use(logger('dev'));
app.use(bodyParser.json());

// Implement PhoneBook router middleware
app.use('/phonebook', new PhoneBookRouter());

// Error 404 Handler middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'NOT FOUND',
  });
});

// Global Error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message,
  });
});

// defining Port number
const port = process.env.PORT || 3000;

// server listener.
app.listen(port, () => {
  console.log('App Listening On:', port);
});
