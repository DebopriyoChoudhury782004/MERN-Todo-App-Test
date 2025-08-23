import React, { useState } from 'react';

const Todo = ({ todo, toggleComplete, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [newPriority, setNewPriority] = useState(todo.priority);
  const [newDueDate, setNewDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : '');

  const handleSave = () => {
    if (newText.trim()) {
      console.log("Sending update:", {
        text: newText,
        priority: newPriority,
        dueDate: newDueDate
      });

      editTodo(todo._id, {
        text: newText,
        priority: newPriority,
        dueDate: newDueDate
      });

      setIsEditing(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority ? todo.priority.toLowerCase() : ''}`}>
      {isEditing ? (
        <>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="Low">Low 🔵</option>
            <option value="Medium">Medium 🟡</option>
            <option value="High">High 🔴</option>
          </select>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span onClick={() => toggleComplete(todo._id, todo.completed)}>
            {todo.text} ({todo.priority}) {todo.dueDate ? `- Due: ${new Date(todo.dueDate).toLocaleDateString()}` : ''}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTodo(todo._id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default Todo;
