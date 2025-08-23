// backend/models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional, but good
    required: true
  }
});

module.exports = mongoose.model('Todo', todoSchema);