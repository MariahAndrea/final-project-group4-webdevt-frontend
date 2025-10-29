import React, {useState} from "react";

function Register () {
    const [username, setUsername ] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateEmail = () => {
        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address");
        } else {
            setError("");
        }
    };

    const validatePassword = () => {
        if (confirmPassword && password !== confirmPassword){
            setError("Passwords do not match");
            return;
        } else {
            setError("");
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address");
            return;
        } 

        if (password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        /*if (!email.includes("@") || !email.includes(".")){
            setError("Please enter a valid email address");
            return;
        }*/

        setError("");
    };

    return(
        <div className="registerSection">
            <div className="registerContainer">
                <form onSubmit={handleSubmit}>

                    <div className="formHeader">
                        <h2>Sign Up</h2>
                    </div>

                    <div className="formGroup">
                        <label>Username</label>
                        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="formControl" placeholder="Enter username"/>
                    </div>

                    <div className="formGroup">
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} required className="formControl" placeholder="Enter email"/>
                        {error && error.includes("email") && (
                            <p>{error}</p>
                        )}
                    </div>

                    <div className="formGroup">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="formControl" placeholder="Enter password"/>
                    </div>

                    <div className="formGroup">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validatePassword} required className="formControl" placeholder="Enter password"/>
                        {error && error.includes("Passwords") && (
                            <p>{error}</p>
                        )}
                    </div>

                    <button type="submit" className="submitButton">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default Register;