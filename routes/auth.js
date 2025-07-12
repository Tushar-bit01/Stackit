const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');

// Main auth landing page (buttons for sign in / sign up)
router.get('/', (req, res) => {
  res.render('auth/index');  // ✅ Renders views/auth/index.ejs
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register');  // ✅ Renders views/auth/register.ejs
});

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login');  // ✅ Renders views/auth/login.ejs
});

// Handle Register
router.post('/register',
    [
      body('username').isLength({ min: 5 }),
      body('email').isEmail(),
      body('password').isLength({ min: 6 })
    ],
    async (req, res) => {
      try {
        console.log('\n🔍 ========== REGISTER REQUEST ==========');
        console.log('📝 Request body:', req.body);
        
        // Check if data is received
        if (!req.body || Object.keys(req.body).length === 0) {
          console.log('❌ No data received in request body');
          return res.status(400).json({ message: 'No data received' });
        }
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log('❌ Validation errors:', errors.array());
          return res.status(400).json({ errors: errors.array() });
        }
  
        const { username, email, password } = req.body;
        console.log('✅ Data extracted successfully:', { username, email, password: '***' });
  
        // Check database connection
        if (mongoose.connection.readyState !== 1) {
          console.log('❌ Database not connected. State:', mongoose.connection.readyState);
          return res.status(500).json({ message: 'Database connection error' });
        }
        console.log('✅ Database connected');
  
        // Check if user already exists
        console.log('🔍 Checking if user exists...');
        const userExists = await User.findOne({ email });
        if (userExists) {
          console.log('❌ User already exists with email:', email);
          return res.status(400).json({ message: 'User already exists' });
        }
        console.log('✅ User does not exist, proceeding...');
  
        // Hash password
        console.log('🔍 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed successfully');
  
        // Create new user
        console.log('🔍 Creating new user...');
        const newUser = new User({
          username,
          email,
          password: hashedPassword
        });
  
        // Save user to database
        console.log('🔍 Saving user to database...');
        const savedUser = await newUser.save();
        console.log('✅ User saved successfully!');
        console.log('📝 Saved user ID:', savedUser._id);
  
        console.log('🔍 Redirecting to login page...');
        res.redirect('/auth/login');
        
      } catch (error) {
        console.error('❌ Registration error:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ 
          message: 'Server error', 
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
);

// Handle Login - ORIGINAL VERSION WITH SESSION FIX
router.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      console.log('\n🔍 ========== LOGIN REQUEST ==========');
      console.log('📝 Request body:', req.body);
      console.log('📝 Content-Type:', req.get('Content-Type'));
      
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      console.log('🔍 Looking for user:', username);
      
      // Find user in database
      const user = await User.findOne({ username });
      if (!user) {
        console.log('❌ User not found');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      console.log('✅ User found, checking password...');
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('❌ Invalid password');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('✅ Password valid, creating token...');
      
      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log('✅ Token created, setting cookie and session...');
      
      // Set cookie with proper options
      res.cookie('token', token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
      
      // ALSO SET SESSION FOR CONSISTENCY
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email
      };
      
      console.log('✅ Cookie and session set, redirecting to home page...');
      console.log('✅ Session user:', req.session.user);
      
      // Redirect to home page
      res.redirect('/');
      
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Logout
router.get('/logout', (req, res) => {
  console.log('🔍 Logout requested');
  
  // Clear cookie
  res.clearCookie('token');
  
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Error destroying session:', err);
    }
    console.log('✅ Cookie cleared and session destroyed, redirecting to home');
    res.redirect('/');
  });
});

module.exports = router;