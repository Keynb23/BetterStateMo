import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginReg = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { auth, loading } = useAuth(); // Removed user and signOut as they aren't needed here
  const [activeForm, setActiveForm] = useState("login");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (activeForm === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/profile"); // <-- REDIRECT on success
    } catch (err) {
      setError(`Failed to ${activeForm}. Please check your credentials.`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="LoginReg-loadingWrapper">
        <p className="LoginReg-loadingText">Loading...</p>
      </div>
    );
  }

  // The `if (user)` block is removed, as the Navbar now handles the logged-in state.

  return (
    <div className="login-register-container">
      <div className="login-register-header">
        <button
          className={activeForm === "login" ? "active" : ""}
          onClick={() => setActiveForm("login")}
        >
          Login
        </button>
        <button
          className={activeForm === "register" ? "active" : ""}
          onClick={() => setActiveForm("register")}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className={`${activeForm}-form`}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-register-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-register-input"
          required
        />
        <button type="submit" className="login-register-button">
          {activeForm === "login" ? "Login" : "Register"}
        </button>
      </form>

      {error && <p className="login-register-error">{error}</p>}
    </div>
  );
};

export default LoginReg;