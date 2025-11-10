import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');   

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

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
        <div className="loginScreen">    
            <div className="loginContainer">        
                <form onSubmit={handleSubmit}>
                    <div className="formHeader">
                        <h2>Sign in to  your account</h2>
                    </div>

                    {/*Email or username input*/}
                    <div className="formGroup">
                        <label>Email/Username</label>
                        <div className="inputBox">
                            <input type="text" name="emailOrUsername" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required className="formControl" placeholder="Enter email or username"/>
                        </div>
                    </div>

                    {/*Password input*/}
                    <div className = "formGroup">
                        <div className="labelsAndText">
                            <label>Password</label>
                            <div className="linkPassword"> 
                                <a href="#">Forgot Password?</a>
                            </div>
                        </div>
                        <div className="inputBox">
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password"/>
                        </div> 
                    </div>

                    {/*Submit button*/}
                    <button type="submit" className="submitButton">Sign In</button>
                </form>

                <p>No account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
}

export default Login;