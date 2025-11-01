import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../styles/HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/logout`);
        } catch (error) {
            console.error('Logout failed:', error);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        navigate('/');
    };

    const features = [
        { title: "Fresh & Organic", desc: "Get naturally grown fruits, vegetables, dairy, and more directly from trusted farmers.", color: "#10b981" },
        { title: "Fair Prices for Farmers", desc: "We empower farmers by ensuring they receive a fair share of their hard work.", color: "#3b82f6" },
        { title: "Support Local Agriculture", desc: "Your purchase helps local farmers thrive and promotes sustainable farming.", color: "#f97316" },
        { title: "Quick & Easy Orders", desc: "Browse, buy, and get doorstep delivery with just a few clicks.", color: "#8b5cf6" }
    ];

    return (
        <div className="homepage-wrapper">
            <motion.h2 
                className="homepage-title"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Welcome to <span className="homepage-highlight">Farmify</span>
            </motion.h2>

            <motion.p 
                className="homepage-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Connecting <strong>Farmers & Consumers</strong> directly for fresh, organic produce at fair prices.
            </motion.p>

            <motion.div 
                className="homepage-features-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
            >
                {features.map((feature, index) => (
                    <motion.div 
                        key={index}
                        className="homepage-feature-card"
                        style={{ borderLeft: `6px solid ${feature.color}` }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 style={{ color: feature.color }}>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="homepage-cta-buttons">
                <button className="homepage-btn homepage-btn-green" onClick={() => navigate('/marketplace')}>
                    Visit Marketplace
                </button>
                <button className="homepage-btn homepage-btn-red" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;