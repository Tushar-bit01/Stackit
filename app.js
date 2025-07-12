const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');

// Load environment variables first
dotenv.config();

// MongoDB Connection
require('./config/db')();

// Middlewares
app.use(express.json()); // ✅ for JSON body parsing (API support)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Session
app.use(session({
    secret: 'stackit-secret',
    resave: false,
    saveUninitialized: false,
}));

// Make user available in all templates
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null; // Safe check
    next();
});

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pass user to all views (if logged in)
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.currentUser = decoded;
        } catch (err) {
            res.locals.currentUser = null;
        }
    } else {
        res.locals.currentUser = null;
    }
    next();
});

// Import routes
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const questionRoutes = require('./routes/question');

// Routes
app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/questions', questionRoutes);

module.exports = app;