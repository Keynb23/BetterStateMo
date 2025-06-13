import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from './AuthContext.jsx'; // Corrected import path

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
      // User will be redirected by the App component's routing logic
    } catch (err) {
      setError('Failed to log in. Check your email and password.');
      console.error(err);
    }
  };

  if (loading) return <div className="LoginReg-loadingWrapper"><p className="LoginReg-loadingText">Loading authentication...</p></div>;
  if (user) return <div className="LoginReg-loggedInWrapper"><p className="LoginReg-loggedInText">You are already logged in as {user.email || 'an anonymous user'}!</p><button onClick={() => signOut(auth)} className="LoginReg-logoutBtn">Logout</button></div>;

  return (
    <div className="LoginReg-wrapper">
      <div className="LoginReg-modal">
        <h2 className="LoginReg-title">Owner Login</h2>
        <form onSubmit={handleLogin} className="LoginReg-form">
          <div className="LoginReg-formGroup">
            <label className="LoginReg-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="LoginReg-input"
              placeholder="owner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="LoginReg-formGroup">
            <label className="LoginReg-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="LoginReg-input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="LoginReg-error">{error}</p>}
          <button
            type="submit"
            className="LoginReg-submitBtn"
          >
            Login as Owner
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginReg;
