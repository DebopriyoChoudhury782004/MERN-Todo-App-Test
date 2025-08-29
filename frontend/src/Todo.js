import React, { useState } from 'react';

const Todo = ({ todo, toggleComplete, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [newPriority, setNewPriority] = useState(todo.priority || "Low");
  const [newDueDate, setNewDueDate] = useState(
    todo.dueDate ? todo.dueDate.split('T')[0] : ''
  );

  const handleSave = () => {
    if (!newText.trim()) return;

    const updatedTodo = {
      text: newText.trim(),
      priority: newPriority,
      dueDate: newDueDate || null,
    };

    console.log("✏️ Updating todo:", todo._id, updatedTodo);

    // Call parent edit function
    editTodo(todo._id, updatedTodo);

    setIsEditing(false);
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${
        todo.priority ? todo.priority.toLowerCase() : ''
      }`}
      onClick={() => {
        if (!todo.completed) {
          toggleComplete(todo._id, todo.completed);
        }
      }}
      style={{
        cursor: todo.completed ? "not-allowed" : "pointer",
        opacity: todo.completed ? 0.6 : 1,
      }}
    >
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

          <button onClick={(e) => { e.stopPropagation(); handleSave(); }}>
            Save
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span>
            {todo.text} ({todo.priority}){" "}
            {todo.dueDate
              ? `- Due: ${new Date(todo.dueDate).toLocaleDateString()}`
              : ""}
          </span>

          <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
            Edit
          </button>
          <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id); }}>
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default Todo;
