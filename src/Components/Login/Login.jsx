import React, { useState } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { BACKEND_URL } from '../../constants';

const LOGIN_ENDPOINT = `${BACKEND_URL}/login`;

function ErrorMessage({ message }) {
    return <div className="error-message">{message}</div>;
}

ErrorMessage.propTypes = {
    message: propTypes.string.isRequired,
};

function LoginForm({ visible, cancel, setError }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (event) => {
        event.preventDefault();
        try {
            await axios.post(LOGIN_ENDPOINT, { email, password });
            alert('Logged in successfully!');
            cancel();
        } catch (error) {
            console.error('Login error:', error);
            setError(`Login failed: ${error.message}`);
        }
    };

    if (!visible) return null;

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

            <button type="button" onClick={cancel}>Cancel</button>
            <button type="submit">Log In</button>
        </form>
    );
}

LoginForm.propTypes = {
    visible: propTypes.bool.isRequired,
    cancel: propTypes.func.isRequired,
    setError: propTypes.func.isRequired,
};

function Login() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [error, setError] = useState('');

    return (
        <div className="wrapper">
            <h1>Welcome Back</h1>
            <p>Please log in to continue</p>
            <button
                type="button"
                onClick={() => setShowLoginForm(true)}
            >
                Log In
            </button>

            <LoginForm
                visible={showLoginForm}
                cancel={() => setShowLoginForm(false)}
                setError={setError}
            />

            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default Login;