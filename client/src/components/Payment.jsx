import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Payment.css";

const Payment = () => {
    const navigate = useNavigate();
    const { userId, orderId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const totalPrice = queryParams.get("total");
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [transactionId] = useState('txn_1234567890');
    const [isProcessing, setIsProcessing] = useState(false);
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error('You must be logged in to make a payment.');
        navigate('/login');
        return null;
    }

    const handlePayment = async () => {
        if (!totalPrice || parseFloat(totalPrice) <= 0) {
            toast.error('Invalid payment amount.');
            return;
        }

        setIsProcessing(true);
        const paymentDetails = {
            amount: parseFloat(totalPrice),
            paymentMethod,
            transactionId
        };

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/payment/pay/${userId}/${orderId}`, paymentDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success('Payment processed successfully! Redirecting to home...');
            setTimeout(() => navigate('/home'), 2000);
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-container">
            <h1 className="payment-title">Payment Page</h1>
            
            <div className="payment-info">
                <h2 className="payment-order-id">Order ID: {orderId}</h2>
                <p className="payment-total">Total Price: ₹{totalPrice}</p>
            </div>

            <div className="payment-methods">
                <h3 className="payment-methods-title">Select Payment Method</h3>
                <div className="payment-options">
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="credit_card"
                            checked={paymentMethod === 'credit_card'}
                            onChange={() => setPaymentMethod('credit_card')}
                            className="payment-radio"
                        />
                        <span className="payment-option-label">Credit Card</span>
                    </label>
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                            className="payment-radio"
                        />
                        <span className="payment-option-label">PayPal</span>
                    </label>
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="bank_transfer"
                            checked={paymentMethod === 'bank_transfer'}
                            onChange={() => setPaymentMethod('bank_transfer')}
                            className="payment-radio"
                        />
                        <span className="payment-option-label">Bank Transfer</span>
                    </label>
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                            className="payment-radio"
                        />
                        <span className="payment-option-label">UPI</span>
                    </label>
                </div>
            </div>

            <button 
                className={`payment-button ${isProcessing ? 'payment-button-processing' : ''}`}
                onClick={handlePayment}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
            </button>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Payment;