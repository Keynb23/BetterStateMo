import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from './AuthContext.js';

const LoginReg = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { auth, user, loading, signOut } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Failed to log in. Check your email and password.');
      console.error(err);
    }
  };

  if (loading) return <div className="login-page loading-container"><p className="loading-text">Loading authentication...</p></div>;
  if (user) return <div className="login-page logged-in-container"><p className="logged-in-text">You are already logged in as {user.email || 'an anonymous user'}!</p><button onClick={() => signOut(auth)} className="logout-button">Logout</button></div>;

  return (
    <div className="login-page login-container">
      <div className="login-form">
        <h2 className="form-title">Owner Login</h2>
        <form onSubmit={handleLogin} className="form-content">
          <div>
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="owner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            Login as Owner
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginReg;