import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
    const navigate = useNavigate();
    const { userId, orderId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const totalPrice = queryParams.get("total");
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [transactionId] = useState('txn_1234567890');
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error('You must be logged in to make a payment.');
        navigate('/login');
        return null;
    }

    const handlePayment = async () => {
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
        }
    };

    return (
        <div className="payment-container">
            <style>{`
                .payment-container {
                    max-width: 600px;
                    margin: 60px auto;
                    background: linear-gradient(to right, #f9f9fb, #e6ecf4);
                    border-radius: 12px;
                    padding: 30px 40px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    animation: fadeInUp 0.6s ease;
                    font-family: 'Segoe UI', sans-serif;
                    color: #333;
                }
                h1 {
                    font-size: 28px;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #2c3e50;
                }
                h2 {
                    font-size: 20px;
                    margin-bottom: 15px;
                    color: #444;
                }
                h3 {
                    margin: 25px 0 10px;
                    color: #555;
                }
                p {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 12px;
                    cursor: pointer;
                    font-size: 16px;
                    padding-left: 4px;
                }
                input[type="radio"] {
                    margin-right: 8px;
                }
                button {
                    width: 100%;
                    padding: 12px;
                    font-size: 16px;
                    background: linear-gradient(to right, #6a11cb, #2575fc);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(101, 132, 255, 0.3);
                    margin-top: 20px;
                }
                button:hover {
                    transform: translateY(-2px);
                    background: linear-gradient(to right, #5e0ec9, #1d5ffd);
                    box-shadow: 0 6px 18px rgba(101, 132, 255, 0.5);
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 600px) {
                    .payment-container {
                        padding: 20px;
                        margin: 30px 10px;
                    }

                    button {
                        font-size: 14px;
                        padding: 10px;
                    }
                }
            `}</style>

            <h1>Payment Page</h1>
            <h2>Order ID: {orderId}</h2>
            <p>Total Price: ₹{totalPrice}</p>

            <div>
                <h3>Select Payment Method</h3>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                    />
                    Credit Card
                </label>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                    />
                    PayPal
                </label>
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                    />
                    Bank Transfer
                </label>
            </div>

            <button onClick={handlePayment}>Complete Payment</button>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Payment;

