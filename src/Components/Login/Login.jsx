import React, { useState } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { BACKEND_URL } from '../../constants';

const LOGIN_ENDPOINT = `${BACKEND_URL}/login`;
const REGISTER_ENDPOINT = `${BACKEND_URL}/register`;

function ErrorMessage({ message }) {
    return <div className="error-message">{message}</div>;
}

ErrorMessage.propTypes = {
    message: propTypes.string.isRequired,
};

function LoginForm({ email, setEmail, password, setPassword, onSignUpClick, login }) {
    return (
        <form onSubmit={login} className="login-form">
            <h3>Log In</h3>

            <label htmlFor="email">Email</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label htmlFor="password" style={{ display: 'block', marginBottom: '1.5rem' }}>
                Password
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit">Log In</button>
                <button type="button" onClick={onSignUpClick}>Sign Up</button>
            </div>
        </form>
    );
}

LoginForm.propTypes = {
    setError: propTypes.func.isRequired,
    email: propTypes.string.isRequired,
    setEmail: propTypes.func.isRequired,
    password: propTypes.string.isRequired,
    setPassword: propTypes.func.isRequired,
    onSignUpClick: propTypes.func.isRequired,
    login: propTypes.func.isRequired,
};

function SignUpPopup({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('author');

    SignUpPopup.propTypes = {
        onClose: propTypes.func.isRequired,
    };


    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await axios.post(REGISTER_ENDPOINT, {
                username: email,
                password: password,
                name: name,
                level: role === 'editor' ? 1 : 0
            });
            alert('Registered successfully!');
            onClose();
        } catch (error) {
            console.error('Registration error:', error);
            setError(`Registration failed: ${error.message}`);
        }
    };
    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Sign Up</h3>
                {error && <div className="error-message">{error}</div>}
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label>Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                </select>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button onClick={handleRegister}>Register</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}


function Login() {
    const [error, setError] = useState('');
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (event) => {
        event.preventDefault();
        try {
            await axios.put(LOGIN_ENDPOINT, { username: email, password: password });
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            alert('Logged in successfully!');
        } catch (error) {
            console.error('Login error:', error);
            setError(`Login failed: ${error.message}`);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
        }
    };

    return (
        <div className="wrapper">
            <h1>Welcome Back</h1>
            <p>Please log in to continue</p>

            <LoginForm
                setError={setError}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSignUpClick={() => setShowRegisterPopup(true)}
                login={login}
            />
            {error && <ErrorMessage message={error} />}
            {showRegisterPopup && <SignUpPopup onClose={() => setShowRegisterPopup(false)} />}
        </div>
    );
}

export default Login;