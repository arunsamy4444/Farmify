import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PaymentList.css";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/get/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data.payments || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div className="payment-list-loading">Loading payments...</div>;
  if (error) return <div className="payment-list-error">{error}</div>;

  return (
    <div className="payment-list-container">
      <h2 className="payment-list-title">Payment Records</h2>
      
      {payments.length === 0 ? (
        <div className="payment-list-empty">
          No payment records found
        </div>
      ) : (
        <div className="payment-list-table-container">
          <table className="payment-list-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="payment-list-row">
                  <td className="payment-list-user">
                    {payment.userId?.name || "Unknown"}
                  </td>
                  <td className="payment-list-email">
                    {payment.userId?.email || "No email"}
                  </td>
                  <td className="payment-list-amount">
                    ₹{payment.amount?.toLocaleString() || "0"}
                  </td>
                  <td className="payment-list-method">
                    <span className={`payment-method-badge payment-method-${payment.paymentMethod?.toLowerCase() || 'unknown'}`}>
                      {payment.paymentMethod || "Unknown"}
                    </span>
                  </td>
                  <td className="payment-list-date">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}
                  </td>
                  <td className="payment-list-status">
                    <span className={`status-badge status-${payment.status?.toLowerCase() || 'completed'}`}>
                      {payment.status || "Completed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentList;