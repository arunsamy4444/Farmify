import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Auth.css';

const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
        
        // Show performance notice on component mount
        toast.info(
            '🚀 Hosted on free tier - may be slow. For better performance, use localhost or contact for local demo.',
            { 
                autoClose: 8000,
                position: "top-center"
            }
        );
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Login successful! 🎉');
            setTimeout(() => navigate('/home'), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed ❌';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/signup`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Signup successful! Logging in... 🎉');
            handleLogin(e);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Signup failed ❌';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const showPerformanceNotice = () => {
        toast.info(
            <div>
                <strong>Performance Notice 🚀</strong>
                <br />
                <small>
                    This app is hosted on free tier and may be slow. 
                    <br />
                    For optimal performance:
                    <br />
                    • Use localhost setup
                    <br />
                    • Contact me for local screen share demo
                </small>
            </div>,
            { 
                autoClose: 10000,
                position: "top-center"
            }
        );
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <h2 className="auth-title">{isSignup ? 'Signup' : 'Login'}</h2>
                
                {/* Performance Notice Button */}
                <button 
                    type="button"
                    onClick={showPerformanceNotice}
                    className="performance-notice-btn"
                    title="Click for performance information"
                >
                    ⚡ Performance Notice
                </button>

                {error && <p className="auth-error">{error}</p>}
                
                <form onSubmit={isSignup ? handleSignup : handleLogin} className="auth-form">
                    {isSignup && (
                        <>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="auth-input"
                                disabled={isLoading}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfilePic(e.target.files[0])}
                                className="auth-input"
                                disabled={isLoading}
                            />
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                        disabled={isLoading}
                    />
                    {isSignup && (
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="auth-input"
                            disabled={isLoading}
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}
                    <button 
                        type="submit" 
                        className={`auth-button ${isLoading ? 'auth-button-loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳ Processing...' : (isSignup ? 'Signup' : 'Login')}
                    </button>
                </form>
                
                <button 
                    onClick={() => setIsSignup(!isSignup)} 
                    className="auth-toggle"
                    disabled={isLoading}
                >
                    {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
                </button>
            </div>
            
            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default AuthPage;