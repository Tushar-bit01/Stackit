const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const indexRoute = require('./routes/index');

dotenv.config();
const app = express();

// Connect DB
require('./config/db')();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/test', (req, res) => {
    res.send('Simple test route working!');
});
app.use('/', indexRoute);
// app.use('/', require('./routes/auth'));
// app.use('/questions', require('./routes/questions'));

module.exports = app;
