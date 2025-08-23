import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Toggle state
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      toast.success('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">📝 Sign Up</h2>
      <input
        type="email"
        className="signup-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type={showPassword ? 'text' : 'password'}
        className="signup-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label className="show-password">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        Show Password
      </label>
      <button className="signup-button" onClick={handleSignup}>Sign Up</button>
      <p style={{ marginTop: '10px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
