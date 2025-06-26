import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AuthPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Login successful! 🎉'); // ✅ Toast added
            setTimeout(() => navigate('/home'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Signup failed ❌'); // ✅ Error toast
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
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
            setError(err.response?.data?.error || 'Signup failed');
            toast.error(err.response?.data?.error || 'Signup failed ❌');
        }
        
    };

        return (
  <div className="auth-wrapper">
    <div className="auth-box">
      <h2 className="auth-title">{isSignup ? 'Signup' : 'Login'}</h2>
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
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="auth-input"
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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        {isSignup && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="auth-input"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit" className="auth-button">
          {isSignup ? 'Signup' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)} className="auth-toggle">
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
      </button>
    </div>
    <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    <style>{`
      body {
        margin: 0;
        font-family: 'Segoe UI', sans-serif;
        background: linear-gradient(to right, #f9f9fb, #d8e2f2);
      }

      .auth-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
      }

      .auth-box {
        width: 100%;
        max-width: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        padding: 30px;
        animation: fadeIn 0.4s ease-in-out;
      }

      .auth-title {
        font-size: 24px;
        text-align: center;
        color: #333;
        margin-bottom: 20px;
      }

      .auth-error {
        color: red;
        font-size: 14px;
        text-align: center;
        margin-bottom: 10px;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .auth-input {
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 14px;
        transition: 0.3s;
      }

      .auth-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      }

      .auth-button {
        background: linear-gradient(to right, #3b82f6, #2563eb);
        color: white;
        border: none;
        padding: 10px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
      }

      .auth-button:hover {
        background: linear-gradient(to right, #2563eb, #1e40af);
      }

      .auth-toggle {
        margin-top: 15px;
        width: 100%;
        text-align: center;
        background: none;
        border: none;
        color: #2563eb;
        font-size: 14px;
        cursor: pointer;
        text-decoration: underline;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 500px) {
        .auth-box {
          padding: 20px;
        }
      }
    `}</style>
  </div>
);

};

export default AuthPage;

