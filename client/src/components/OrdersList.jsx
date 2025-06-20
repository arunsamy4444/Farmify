import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/getorders', {
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
      await axios.put(
        `http://localhost:5000/admin/editorders/${orderId}`,
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

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="orders-wrapper">
      <h2>Orders</h2>
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
              <td>{order._id}</td>
              <td>{order.buyer?.name || "Unknown"}</td>
              <td>{order.products?.map((p) => p.productName).join(", ") || "No Product"}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .orders-wrapper {
          max-width: 1000px;
          margin: 30px auto;
          padding: 25px;
          background: linear-gradient(to right, #f9f9fb, #e6ecf4);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.6s ease-in-out;
        }

        h2 {
          text-align: center;
          font-size: 28px;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th, .orders-table td {
          padding: 14px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 14px;
        }

        .orders-table th {
          background: linear-gradient(to right, #00c9ff, #92fe9d);
          color: #fff;
        }

        .orders-table tr:nth-child(even) {
          background-color: #f5f8fa;
        }

        .orders-table tr:hover {
          background-color: #eef3f9;
          transition: 0.3s ease;
        }

        select {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          background: #fff;
          transition: box-shadow 0.3s ease;
        }

        select:hover {
          box-shadow: 0 0 5px rgba(0,0,0,0.15);
        }

        @keyframes fadeIn {
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
          .orders-wrapper {
            padding: 15px;
          }

          .orders-table th, .orders-table td {
            font-size: 12px;
            padding: 10px;
          }

          h2 {
            font-size: 22px;
          }
        }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OrdersList;
