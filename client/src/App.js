import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage'; 
import AdminDashboard from './components/AdminDashboard'; 
import BuyerDashboard from './components/BuyerDashboard'; 
import Payment from './components/Payment';
import UsersList from './components/UsersList.jsx';
import ProductsList from './components/ProductsList';
import OrdersList from './components/OrdersList';
import Navbar from './components/Navbar';
import PaymentList from "./components/PaymentList";
import './App.css';

// Toast Component
const Toast = ({ message, onClose, duration = 8000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="performance-toast">
      <div className="toast-content">
        <div className="toast-icon">⚡</div>
        <div className="toast-text">
          <strong>Performance Notice</strong>
          <p>{message}</p>
          <a 
            href="https://github.com/arunsamy4444/Farmify" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            📥 Get Code on GitHub
          </a>
        </div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
      <div className="toast-progress"></div>
    </div>
  );
};

const App = () => {
  const [showToast, setShowToast] = useState(false);

  // Show toast on every component mount/refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <Router>
      {/* Performance Toast */}
      {showToast && (
        <Toast 
          message="This is hosted on free tier, so it's slow. For better performance, try running locally."
          onClose={closeToast}
        />
      )}
      
      <Navbar/>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/UsersList" element={<UsersList />} />
        <Route path="/ProductsManagement" element={<ProductsList />} />
        <Route path="/OrdersManagement" element={<OrdersList />} />
        <Route path="payments" element={<PaymentList />} />
        <Route path="/payment/:userId/:orderId" element={<Payment />} />
      </Routes>
    </Router>
  );
};

export default App;