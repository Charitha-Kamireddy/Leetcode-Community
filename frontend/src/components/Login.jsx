import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './AuthStyles.css'; // Import the common CSS

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null); // Reset error message before making the request

    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      if (response.data === "success") {
        //this line added later
        localStorage.setItem("loggedInUser", username); 
        navigate("/home"); // Redirect to home on successful login
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-heading login-heading">
          Login <span className="text-green-400">ChatApp</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="auth-label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "Login"}
          </button>

          <Link to="/signup" className="auth-link">
            Don't have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
