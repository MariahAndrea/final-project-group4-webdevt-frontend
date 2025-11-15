//LoginPage.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../css/AuthPage.css";

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState({ emailOrUsername: "", password: "" });
   

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        let valid = true;
        const newErrors = { emailOrUsername: "", password: "" };

        // Validation before submission
        if (!emailOrUsername.trim()) {
            newErrors.emailOrUsername = "Username or Email is required";
            valid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        }

        setErrorMessage(newErrors);

        if (!valid) return;

        const isEmail = emailOrUsername.includes("@");

        console.log(
            isEmail
                ? "Logging in with email: " + emailOrUsername
                : "Logging in with username: " + emailOrUsername
        );

        console.log("Password: ", password);
        navigate("/starmu-creation", { replace: true })
    };

    return (
        <div className="auth-screen">

        <div className="border-design">
            <div className="auth-container"> 

                <div className="auth-header">
                    Starmu Logo
                    <h1>Sign In</h1>
                </div>      

                <form onSubmit={handleSubmit} className="auth-form"> 

                    {/*Email or username input*/}
                    <div className="form-group">
                        <label className="form-label username">Username</label>

                        <input 
                            type="text" 
                            name="emailOrUsername" 
                            className="form-input"
                            value={emailOrUsername} 
                            onChange={(e) => setEmailOrUsername(e.target.value)} 
                            onBlur={() => {
                            if (!emailOrUsername.trim()) {
                                setErrorMessage(prev => ({ ...prev, emailOrUsername: "Username or Email is required" }));
                            } else {
                                setErrorMessage(prev => ({ ...prev, emailOrUsername: "" }));
                                }
                            }}
                            placeholder="Enter email or username"
                            />
                            {errorMessage.emailOrUsername && (<div className="input-error">{errorMessage.emailOrUsername}</div>)}
                    </div>

                    {/*Password input*/}
                    <div className = "form-group">
                        <label className="form-label password">Password</label>

                        <input 
                            type="password" 
                            name="password" 
                            className="form-input"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            onBlur={() => {
                                if (!password) {
                                    setErrorMessage(prev => ({ ...prev, password: "Password is required" }));
                                } else {
                                    setErrorMessage(prev => ({ ...prev, password: "" }));
                                }
                            }}
                            placeholder="Enter password"
                        />
                         {errorMessage.password && (<div className="input-error">{errorMessage.password}</div>)}
                    </div>

                    {/*Submit button*/}
                    <button type="submit" className="auth-button">Sign In</button>
                </form>
            </div>
            </div>
            
                <p className= "auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
        </div>
    );
}

export default Login;