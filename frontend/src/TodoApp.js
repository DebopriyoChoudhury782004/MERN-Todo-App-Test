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
  const [dueTime, setDueTime] = useState('');   
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [authError, setAuthError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  
  // ✅ Persist dark mode
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // ✅ Decode JWT token if exists
  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setUserInfo(jwtDecode(token));
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchTodos();
    decodeToken();
  }, []);

  // ✅ Fetch todos
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🪪 Token sent:', token);

      const res = await API.get('/todos');
      console.log('📥 Todos from backend:', res.data);

      setTodos(res.data);
      setAuthError('');
    } catch (err) {
      console.error('❌ fetchTodos error:', err);
      setAuthError('⚠️ You must be logged in to view your todos.');
    }
  };

  // ✅ Add new todo
  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const response = await API.post('/todos', { text, priority, dueDate, dueTime }); // ✅ include dueTime
      console.log('Added Todo:', response.data);

      setText('');
      setPriority('Medium');
      setDueDate('');
      setDueTime(''); // ✅ reset after add
      
      fetchTodos();
    } catch (err) {
      console.error('Add Todo Error:', err.response?.data || err.message || err);
      setAuthError('⚠️ Failed to add todo. Please login.');
    }
  };

  // ✅ Toggle complete
  const toggleComplete = async (id, completed) => {
    try {
      if (!completed) {
        await API.put(`/todos/${id}`, { completed: true });
        fetchTodos();
      }
    } catch {
      setAuthError('⚠️ Action failed. Please login.');
    }
  };

  // ✅ Delete todo
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      fetchTodos();
    } catch {
      setAuthError('⚠️ Delete failed. Please login.');
    }
  };

  // ✅ Edit todo
  const editTodo = async (id, updatedFields) => {
    if (updatedFields.text && !updatedFields.text.trim()) return;
    try {
      await API.put(`/todos/${id}`, updatedFields);
      fetchTodos();
    } catch {
      setAuthError('⚠️ Edit failed. Please login.');
    }
  };

  // ✅ Filter logic
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  // ✅ Unified render list
  const renderList = filter === 'all' ? todos : filteredTodos;

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // ✅ Progress tracker
  const completedCount = todos.filter((t) => t.completed).length;
  const total = todos.length;
  const progress = total ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="todo-app">
      {/* ✅ User Info + Logout */}
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

      <h1>🎬 Action Planner</h1>

      <div className="progress-container">
        <div className="progress-label">{progress}% tasks completed</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* ✅ Theme Toggle */}
      <button className="btn btn-green" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {authError && <p className="auth-error">{authError}</p>}

      {/* ✅ Todo Input */}
      <div className="todo-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Enter new todo"
        />

        <div className="priority-dropdown">
          <button className="priority-btn">
            {priority === 'Low' ? '🔵 Low' :
             priority === 'Medium' ? '🟡 Medium' :
             priority === 'High' ? '🔴 High' : '⚪ Set Priority'}
          </button>
          <div className="priority-options">
            <div onClick={() => setPriority('Low')} className="priority-option low">🔵 Low</div>
            <div onClick={() => setPriority('Medium')} className="priority-option medium">🟡 Medium</div>
            <div onClick={() => setPriority('High')} className="priority-option high">🔴 High</div>
          </div>
        </div>

        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        {/* ✅ NEW Time Field */}
        <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />

        <button className="btn btn-green" onClick={addTodo}>
          Add
        </button>
      </div>

      {/* ✅ Filters */}
      <div className="filters">
        <button className="btn btn-green" onClick={() => setFilter('all')}>
          All
        </button>
        <button className="btn btn-green" onClick={() => setFilter('completed')}>
          Completed ✅
        </button>
        <button className="btn btn-green" onClick={() => setFilter('pending')}>
          Pending ⏳
        </button>
      </div>

      {/* ✅ Todo List Display */}
      <div className="todo-list">
        {renderList.length === 0 ? (
          <p className="empty-state">🎉 You're all caught up!</p>
        ) : (
          renderList.map((todo) => (
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
