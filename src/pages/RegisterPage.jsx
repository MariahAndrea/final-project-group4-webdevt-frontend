//RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // import useNavigate
import "../css/AuthPage.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); // initialize navigate
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = () => {
    setErrorMessage((prev) => ({
      ...prev,
      email: !emailPattern.test(email)
        ? "Please enter a valid email address"
        : "",
    }));
  };

  const validatePassword = () => {
    setErrorMessage((prev) => ({
      ...prev,
      confirmPassword:
        confirmPassword && password !== confirmPassword
          ? "Passwords do not match"
          : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // validation before submission
    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrorMessage(newErrors);

    if (!valid) return;

    console.log("Registering user:", { username, email, password });
    navigate("/", { replace: true });
  };

  return (
    <div className="auth-screen">
      <div className="border-design">
        <div className="auth-container">
          <div className="auth-header">
            Starmu Logo
            <h1>Sign Up</h1>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => {
                  if (!username.trim()) {
                    setErrorMessage((prev) => ({
                      ...prev,
                      username: "Username is required",
                    }));
                  } else {
                    setErrorMessage((prev) => ({ ...prev, username: "" }));
                  }
                }}
                className="form-input"
                placeholder="Enter username"
              />
              {errorMessage.username && (
                <div className="input-error">{errorMessage.username}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className="form-input"
                placeholder="Enter email"
              />
              {errorMessage.email && (
                <div className="input-error">{errorMessage.email}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter password"
              />
              {errorMessage.password && (
                <div className="input-error">{errorMessage.password}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validatePassword}
                className="form-input"
                placeholder="Enter password"
              />
              {errorMessage.confirmPassword && (
                <div className="input-error">
                  {errorMessage.confirmPassword}
                </div>
              )}
            </div>

            <button type="submit" className="auth-button">
              Register
            </button>
          </form>
        </div>
      </div>

      <p className="auth-footer">
        Already have an account? <span className="auth-link"> <Link to="/">Sign In</Link> </span>
      </p>
    </div>
  );
}

export default Register;