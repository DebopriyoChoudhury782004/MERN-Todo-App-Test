import React, { useState } from "react";

const Todo = ({ todo, toggleComplete, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [newPriority, setNewPriority] = useState(todo.priority || "Low");

  // ✅ keep date & time separate
  const [newDueDate, setNewDueDate] = useState(todo.dueDate || "");
  const [newDueTime, setNewDueTime] = useState(todo.dueTime || "");

  const handleSave = () => {
    if (!newText.trim()) return;

    const updatedTodo = {
      text: newText.trim(),
      priority: newPriority,
      dueDate: newDueDate || null,
      dueTime: newDueTime || null,
    };

    console.log("✏️ Updating todo:", todo._id, updatedTodo);
    editTodo(todo._id, updatedTodo);
    setIsEditing(false);
  };

  // ✅ Format due date/time
  const formatDue = (dateStr, timeStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    return `${formattedDate}${timeStr ? " " + timeStr : ""}`;
  };

  return (
    <div
      className={`todo-item ${todo.completed ? "completed" : ""} ${
        todo.priority ? todo.priority.toLowerCase() : ""
      }`}
      onClick={() => {
        if (isEditing) return;
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
            onClick={(e) => e.stopPropagation()}
          />

          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="Low">Low 🔵</option>
            <option value="Medium">Medium 🟡</option>
            <option value="High">High 🔴</option>
          </select>

          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          <input
            type="time"
            value={newDueTime}
            onChange={(e) => setNewDueTime(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
          >
            Save
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span>
            {todo.text} ({todo.priority}){" "}
            {todo.dueDate ? `- Due: ${formatDue(todo.dueDate, todo.dueTime)}` : ""}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTodo(todo._id);
            }}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default Todo;
