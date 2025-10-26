import React, { useState } from "react";

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const isEmail = emailOrUsername.includes("@");

        if (isEmail) {
            console.log("Login with email: ", emailOrUsername);
        } else {
            console.log("Login with username: ", emailOrUsername);
        }
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
                            <input type="texts" name="emailOrUsername" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required className="formControl" placeholder="Enter email or username"/>
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

                <p>No account? <a href="#">Register</a> </p>
            </div>
        </div>
    );
}

export default Login;