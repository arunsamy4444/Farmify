import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

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
                Welcome to <span className="highlight">Farmify</span>
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
                className="features-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
            >
                {features.map((feature, index) => (
                    <motion.div 
                        key={index}
                        className="feature-card"
                        style={{ borderLeft: `6px solid ${feature.color}` }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 style={{ color: feature.color }}>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="cta-buttons">
                <button className="btn green" onClick={() => navigate('/marketplace')}>
                    Visit Marketplace
                </button>
                <button className="btn red" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <style>{`
                .homepage-wrapper {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 30px 20px;
                    background: linear-gradient(to bottom right, #d1fae5, #e0f2fe);
                    text-align: center;
                    font-family: 'Segoe UI', sans-serif;
                }

                .homepage-title {
                    font-size: 38px;
                    font-weight: 800;
                    color: #1f2937;
                    margin-bottom: 12px;
                }

                .highlight {
                    color: #059669;
                }

                .homepage-subtitle {
                    font-size: 18px;
                    color: #4b5563;
                    max-width: 600px;
                    margin-bottom: 30px;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    max-width: 1000px;
                    width: 100%;
                    margin-bottom: 40px;
                }

                .feature-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease-in-out;
                    text-align: left;
                }

                .feature-card h3 {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .feature-card p {
                    font-size: 14px;
                    color: #4b5563;
                }

                .cta-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                @media(min-width: 600px) {
                    .cta-buttons {
                        flex-direction: row;
                    }
                }

                .btn {
                    padding: 12px 24px;
                    font-size: 16px;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: background 0.3s ease;
                }

                .btn.green {
                    background-color: #059669;
                    color: white;
                }

                .btn.green:hover {
                    background-color: #047857;
                }

                .btn.red {
                    background-color: #dc2626;
                    color: white;
                }

                .btn.red:hover {
                    background-color: #b91c1c;
                }
            `}</style>
        </div>
    );
};

export default HomePage;

