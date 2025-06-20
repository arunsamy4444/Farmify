import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/admin/get/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data.payments);
      } catch (err) {
        setError("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="payment-container">
      <h2>Payment Records</h2>
      <table className="payment-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.userId?.name || "Unknown"}</td>
              <td>{payment.userId?.email || "No email"}</td>
              <td>₹{payment.amount}</td>
              <td>{new Date(payment.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .payment-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 30px;
          background: linear-gradient(to right, #f9f9fb, #e6ecf4);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          animation: fadeSlide 0.6s ease-in-out;
        }

        h2 {
          text-align: center;
          font-size: 28px;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .payment-table {
          width: 100%;
          border-collapse: collapse;
          overflow-x: auto;
        }

        .payment-table th, .payment-table td {
          padding: 14px 16px;
          border: 1px solid #ddd;
          text-align: left;
          font-size: 15px;
        }

        .payment-table th {
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: #fff;
        }

        .payment-table tr:nth-child(even) {
          background: #f1f4f8;
        }

        .payment-table tr:hover {
          background: #e9efff;
          transition: background 0.3s ease;
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .payment-container {
            padding: 20px;
          }

          .payment-table th, .payment-table td {
            padding: 10px;
            font-size: 14px;
          }

          h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentList;

