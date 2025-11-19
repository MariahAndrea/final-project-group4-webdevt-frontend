//LoginPage.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useGame } from "../store/GameContext";
import "../css/AuthPage.css";

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState({ emailOrUsername: "", password: "" });
   

    const navigate = useNavigate();
    const { setStarmuData, setHp, setHunger, setHappiness, setCoins, setStargleams, setInventoryItems, setCustomizationItems } = useGame();

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

        // Normalize the API base so it always includes `/api` and has no trailing slash.
        // This handles cases where the deploy env sets VITE_API_BASE without `/api`.
        const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
        const normalized = rawBase.replace(/\/+$/g, '');
        const API_BASE = normalized.endsWith('/api') ? normalized : `${normalized}/api`;

        (async () => {
            try {
                const resp = await fetch(`${API_BASE}/users/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailOrUsername, password })
                });
                const data = await resp.json();
                if (!resp.ok) {
                    setErrorMessage(prev => ({ ...prev, password: data.error || 'Login failed' }));
                    return;
                }
                // store user id for later use
                const userId = data.user?.id;
                if (userId) localStorage.setItem('userId', userId);

                // populate GameContext with user values (coins, stargleams, inventory)
                if (data.user) {
                    if (typeof data.user.coins !== 'undefined') setCoins(data.user.coins);
                    if (typeof data.user.stargleams !== 'undefined') setStargleams(data.user.stargleams);
                    if (Array.isArray(data.user.inventoryItems)) setInventoryItems(data.user.inventoryItems);
                    if (Array.isArray(data.user.customizationItems)) setCustomizationItems(data.user.customizationItems);
                }
                // Debug: log returned user and current localStorage
                console.log('Login response user:', data.user);
                console.log('After login localStorage:', {
                    userId: localStorage.getItem('userId'),
                    petId: localStorage.getItem('petId'),
                    coins: localStorage.getItem('coins'),
                    stargleams: localStorage.getItem('stargleams')
                });

                // Check if user already has a pet
                try {
                    const petResp = await fetch(`${API_BASE}/pets/owner/${userId}`);
                    if (petResp.ok) {
                        const body = await petResp.json();
                        const pets = body?.pets || [];
                        if (pets.length > 0) {
                            const pet = pets[0];
                            // map backend enum to frontend key
                            const backendToFrontend = {
                                Purple: 'purple',
                                Pink: 'pink',
                                MintGreen: 'mintGreen',
                                BabyBlue: 'babyBlue',
                                Beige: 'beige'
                            };
                            const frontColor = backendToFrontend[pet.color] || pet.color;
                            setStarmuData({ name: pet.name, color: frontColor });
                            if (typeof pet.hp !== 'undefined') setHp(pet.hp);
                            if (typeof pet.hunger !== 'undefined') setHunger(pet.hunger);
                            if (typeof pet.happiness !== 'undefined') setHappiness(pet.happiness);
                            localStorage.setItem('petId', pet._id || pet.id);
                            navigate('/starmu-page', { replace: true });
                            return;
                        }
                    }
                } catch (err) {
                    console.error('Failed to check existing pet after login', err);
                }

                // no pet: go to creation
                navigate("/starmu-creation", { replace: true });
            } catch (err) {
                setErrorMessage(prev => ({ ...prev, password: 'Network error' }));
            }
        })();
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
                        <label className="form-label username">Username/Email</label>

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
                    Don't have an account? <span className="auth-link"> <Link to="/register">Register</Link> </span>
                </p>
        </div>
    );
}

export default Login;