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

function LoginForm({ setError }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (event) => {
        event.preventDefault();
        try {
            await axios.put(LOGIN_ENDPOINT, { username: email, password: password });
            alert('Logged in successfully!');
        } catch (error) {
            console.error('Login error:', error);
            setError(`Login failed: ${error.message}`);
        }
    };


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

            <button type="submit">Log In</button>
        </form>
    );
}

LoginForm.propTypes = {
    setError: propTypes.func.isRequired,
};

function Login() {
    const [error, setError] = useState('');

    return (
        <div className="wrapper">
            <h1>Welcome Back</h1>
            <p>Please log in to continue</p>

            <LoginForm setError={setError} />
            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default Login;