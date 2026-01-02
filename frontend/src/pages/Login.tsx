import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api/axios';
import logo from '../assets/Logo.jpg';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await apiClient.post('/login', { email, password });
            const { access_token, user } = response.data;

            login(access_token, user);
            navigate('/');
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError('Invalid credentials. Please check your email and password.');
            } else {
                setError(err.message || 'Login failed. Please try again.');
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-panel">
                <div className="login-header">
                    <img src={logo} alt="Cake Out Logo" className="login-logo" />
                    <h1>Cake Out</h1>
                    <p>Invoice Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-alert">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@cakeout.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
