const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');

// Get all todos for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user }); // ✅ use req.user directly
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Add new todo for the logged-in user
router.post('/', authMiddleware, async (req, res) => {
  console.log('🔐 POST /todos');
  console.log('🧑 req.user:', req.user);
  console.log('📦 req.body:', req.body);

  try {
    const todo = new Todo({
      user: req.user, // ✅ correct
      text: req.body.text,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
    });

    await todo.save();
    console.log('✅ Todo saved:', todo);
    res.status(201).json(todo);
  } catch (err) {
    console.error('❌ Failed to create todo:', err.message);
    res.status(500).json({ message: 'Failed to create todo', error: err.message });
  }
});

// Update a todo (only if it belongs to the logged-in user)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { text, priority, dueDate, completed } = req.body;

    const updateFields = { text, priority, dueDate };
    if (typeof completed !== 'undefined') {
      updateFields.completed = completed;
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user }, // ✅ fixed
      updateFields,
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found or unauthorized' });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a todo (only if it belongs to the logged-in user)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user, // ✅ fixed
    });

    if (!deleted) return res.status(404).json({ error: 'Todo not found or unauthorized' });

    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
