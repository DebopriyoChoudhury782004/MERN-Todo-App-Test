import React, { useEffect, useState } from 'react';
import API from './components/api';
import Todo from './Todo';
import './Todo.css';
import { jwtDecode } from 'jwt-decode';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const decodeToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token); // ✅ use jwtDecode, not jwt_decode
      setUserInfo(decoded);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
};


  useEffect(() => {
    fetchTodos();
    decodeToken();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🪪 Token sent:", token);

      const res = await API.get('/todos', getAuthHeader());
      console.log("📥 Todos from backend:", res.data);

      setTodos(res.data);
      setAuthError('');
    } catch (err) {
      console.error('❌ fetchTodos error:', err);
      setAuthError('⚠️ You must be logged in to view your todos.');
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const response = await API.post('/todos', { text, priority, dueDate });
      console.log('Added Todo:', response.data);
      setText('');
      setPriority('Medium');
      setDueDate('');
      fetchTodos();
    } catch (err) {
      console.error('Add Todo Error:', err.response?.data || err.message || err);
      setAuthError('⚠️ Failed to add todo. Please login.');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await API.put(`/todos/${id}`, { completed: !completed }, getAuthHeader());
      fetchTodos();
    } catch (err) {
      setAuthError('⚠️ Action failed. Please login.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`, getAuthHeader());
      fetchTodos();
    } catch (err) {
      setAuthError('⚠️ Delete failed. Please login.');
    }
  };

  const editTodo = async (id, updatedFields) => {
    if (updatedFields.text && !updatedFields.text.trim()) return;
    try {
      await API.put(`/todos/${id}`, updatedFields, getAuthHeader());
      fetchTodos();
    } catch (err) {
      setAuthError('⚠️ Edit failed. Please login.');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="todo-app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {userInfo?.email && (
          <p style={{ marginLeft: '1rem', color: '#444', fontSize: '14px' }}>
            👤 Logged in as: <strong>{userInfo.email}</strong>
          </p>
        )}
        <button className="btn btn-red" onClick={handleLogout} style={{ margin: '1rem' }}>
          🚪 Logout
        </button>
      </div>

      <h1>📝 Todo App</h1>

      <button className="btn btn-green" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {authError && <p className="auth-error">{authError}</p>}

      <div className="todo-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Enter new todo"
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low 🔵</option>
          <option value="Medium">Medium 🟡</option>
          <option value="High">High 🔴</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button className="btn btn-green" onClick={addTodo}>Add</button>
      </div>

      <div className="filters">
        <button className="btn btn-green" onClick={() => setFilter('all')}>All</button>
        <button className="btn btn-green" onClick={() => setFilter('completed')}>Completed ✅</button>
        <button className="btn btn-green" onClick={() => setFilter('pending')}>Pending ⏳</button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="empty-state">🎉 You're all caught up!</p>
        ) : (
          filteredTodos.map(todo => (
            <Todo
              key={todo._id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoApp;
