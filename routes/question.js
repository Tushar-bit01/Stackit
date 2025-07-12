const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// GET all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.render('questions/index', { questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET create form
router.get('/create', (req, res) => {
  res.render('questions/create');
});

// POST create question
router.post('/', async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    // Validate required fields
    if (!title || !description || !tags) {
      return res.render('questions/create', { 
        error: 'Title, description, and tags are required' 
      });
    }
    
    // Process tags - handle both comma-separated string and array
    let tagArray = [];
    if (typeof tags === 'string') {
      tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (Array.isArray(tags)) {
      tagArray = tags;
    }
    
    // Create new question
    const question = new Question({
      title: title.trim(),
      description: description.trim(),
      tags: tagArray
    });
    
    await question.save();
    
    // Redirect to questions list or the created question
    res.redirect('/questions');
    
  } catch (error) {
    console.error('Error creating question:', error);
    res.render('questions/create', { 
      error: 'Failed to create question. Please try again.' 
    });
  }
});

// GET single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).render('404', { message: 'Question not found' });
    }
    res.render('questions/show', { question });
  } catch (error) {
    res.status(404).render('404', { message: 'Question not found' });
  }
});

// DELETE question
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect('/questions');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;