const express = require('express');
const morgan = require('morgan');
const router = require('./routes/api');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

app.use('/', router);

module.exports = app;