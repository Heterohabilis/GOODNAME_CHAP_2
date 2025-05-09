import React, { useState } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { BACKEND_URL } from '../../constants';
import './Login.css';

const LOGIN_ENDPOINT = `${BACKEND_URL}/login`;
const REGISTER_ENDPOINT = `${BACKEND_URL}/register`;
const PEOPLE_ENDPOINT = `${BACKEND_URL}/people`;

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
    const [affiliation, setAffiliation] = useState('');
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [personData, setPersonData] = useState(null);

    const checkEmailExists = async () => {
        if (!email) {
            setError('Please enter an email address');
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await axios.get(`${PEOPLE_ENDPOINT}`);
            const people = response.data;
            
            const person = Object.values(people).find(p => p.email === email);
            
            if (person) {
                setEmailExists(true);
                setPersonData(person);
                setName(person.name || '');
                setAffiliation(person.affiliation || '');
            } else {
                setEmailExists(false);
                setPersonData(null);
            }
            
            setIsEmailChecked(true);
            setError('');
        } catch (err) {
            console.error('Error checking email:', err);
            setError(`Failed to check email: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isEmailChecked) {
            setError('Please check if your email exists in our system first');
            return;
        }

        setIsLoading(true);
        try {
            if (!emailExists) {
                try {
                    await axios.put(`${PEOPLE_ENDPOINT}/create?user_id=admin`, {
                        name: name,
                        email: email,
                        affiliation: affiliation,
                        roles: "AU"
                    });
                } catch (err) {
                    if (!err.response?.data?.message?.includes('duplicate')) {
                        throw err;
                    }
                }
            }

            let userLevel = 0;

            if (emailExists && personData) {
                const hasNonAuthorRole = personData.roles && 
                    Array.isArray(personData.roles) && 
                    personData.roles.some(role => role !== 'AU');
                
                if (hasNonAuthorRole) {
                    userLevel = 1;
                }
            }

            try {
                await axios.post(REGISTER_ENDPOINT, {
                    username: email,
                    password: password,
                    name: name,
                    affiliation: affiliation,
                    level: userLevel
                });
            } catch (err) {
                if (!err.response?.data?.message?.includes('duplicate email=')) {
                    throw err;
                }
            }

            alert('Registered successfully!');
            onClose();
        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = 'Registration failed: ';
            
            if (error.response) {
                errorMessage += error.response.data?.message || error.response.data?.error || 
                               String(error.response.data) || `Server returned ${error.response.status}`;
            } else if (error.request) {
                errorMessage += 'No response received from server';
            } else {
                errorMessage += error.message || 'Unknown error';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content" style={{ maxWidth: '500px', padding: '30px' }}>
                {error && <div className="error-message" style={{ marginBottom: '15px' }}>{error}</div>}
                
                <form className="signup-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="signup-title" style={{ fontSize: '24px', marginBottom: '15px', textAlign: 'center' }}>Sign Up</div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIsEmailChecked(false);
                                }}
                                required
                                disabled={isEmailChecked}
                                style={{ flex: '1', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button 
                                type="button" 
                                onClick={checkEmailExists}
                                disabled={isLoading || isEmailChecked}
                                style={{ 
                                    padding: '8px 15px', 
                                    backgroundColor: isEmailChecked ? '#cccccc' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isEmailChecked ? 'default' : 'pointer'
                                }}
                            >
                                {isLoading ? "Checking..." : "Check Email"}
                            </button>
                        </div>
                    </div>

                    {isEmailChecked && (
                        <>
                            {emailExists ? (
                                <div className="info-message" style={{ 
                                    backgroundColor: '#d4edda', 
                                    color: '#155724', 
                                    padding: '10px', 
                                    borderRadius: '4px',
                                    marginBottom: '15px' 
                                }}>
                                    Email found in our system. You can proceed with registration.
                                </div>
                            ) : (
                                <div className="info-message" style={{ 
                                    backgroundColor: '#d1ecf1', 
                                    color: '#0c5460', 
                                    padding: '10px', 
                                    borderRadius: '4px',
                                    marginBottom: '15px' 
                                }}>
                                    Email not found. Please provide additional information.
                                </div>
                            )}
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={emailExists && personData?.name}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Affiliation</label>
                                <input
                                    type="text"
                                    value={affiliation}
                                    onChange={(e) => setAffiliation(e.target.value)}
                                    required
                                    disabled={emailExists && personData?.affiliation}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                        <button 
                            type="button" 
                            onClick={handleRegister}
                            disabled={!isEmailChecked || isLoading}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: !isEmailChecked || isLoading ? '#cccccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: !isEmailChecked || isLoading ? 'default' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {isLoading ? "Processing..." : "Register"}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

SignUpPopup.propTypes = {
    onClose: propTypes.func.isRequired,
};

function Login({ onLogin }) {
    const [error, setError] = useState('');
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(LOGIN_ENDPOINT, { username: email, password: password });
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Check if the user is an admin (level >= 1)
            const userData = response.data;
            const isAdmin = userData.level >= 1;
            localStorage.setItem('isAdmin', isAdmin.toString());
            
            alert('Logged in successfully!');
            onLogin();
            window.location.href = '/';
        } catch (error) {
            console.error('Login error:', error);
            setError(`Login failed: ${error.response?.data?.message || error.message}`);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isAdmin');
        }
    };

    return (
        <div className="wrapper">
            <h1>Welcome Back</h1>
            <p>Please log in to continue</p>

            <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSignUpClick={() => setShowRegisterPopup(true)}
                login={login}
            />
            {error && <ErrorMessage message={error} />}
            {showRegisterPopup && (
                <div className="popup-overlay">
                    <SignUpPopup onClose={() => setShowRegisterPopup(false)} />
                </div>
            )}
        </div>
    );
}

Login.propTypes = {
    onLogin: propTypes.func.isRequired,
};

export default Login;
