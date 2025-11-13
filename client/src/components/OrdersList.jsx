import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/OrdersList.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getorders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        setOrders(response.data.orders || []);
        toast.success('Orders fetched successfully!');
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
        toast.error('Failed to fetch orders!');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/editorders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status!');
    }
  };

  if (loading) return <div className="orders-loading">Loading orders...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-wrapper">
      <h2 className="orders-title">Orders Management</h2>
      
      {/* ADD THIS CONTAINER DIV - SAME AS PAYMENT PAGE STRUCTURE */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="orders-id">{order._id}</td>
                <td className="orders-customer">{order.buyer?.name || "Unknown"}</td>
                <td className="orders-product">
                  {order.products?.map((p) => p.productName).join(", ") || "No Product"}
                </td>
                <td className="orders-status">
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td className="orders-actions">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="orders-status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="orders-empty">
          No orders found
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OrdersList;