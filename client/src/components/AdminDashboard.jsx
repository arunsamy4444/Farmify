import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  // Remove unused state variables
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    price: 0,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
    pricePerKg: 0,
    picture: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Remove unused users fetch
        await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/getallusers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const productsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/products`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProducts(productsResponse.data.products);

        const ordersResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/admin/getorders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(ordersResponse.data.orders);
      } catch (error) {
        toast.error("Error fetching dashboard data");
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Remove unused handleEditOrderStatus function
  // const handleEditOrderStatus = async (orderId, status) => {
  //   try {
  //     await axios.put(
  //       `${process.env.REACT_APP_BASE_URL}/admin/editorders/${orderId}`,
  //       { status },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     toast.success("Order status updated successfully");

  //     const updatedOrders = orders.map((order) =>
  //       order._id === orderId ? { ...order, status } : order
  //     );
  //     setOrders(updatedOrders);
  //   } catch (error) {
  //     toast.error("Error updating order status");
  //     console.error("Error updating order status", error);
  //   }
  // };

  const handleAddProduct = async () => {
    const { name, quantity, pricePerKg, picture } = newProduct;

    if (!name || !quantity || !pricePerKg || !picture) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("pricePerKg", pricePerKg);
    formData.append("picture", picture);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/products/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product added successfully");
      setProducts([...products, response.data.product]);

      setNewProduct({
        name: "",
        quantity: 0,
        pricePerKg: 0,
        picture: null,
      });
    } catch (error) {
      toast.error("Error adding product");
      console.error("Error adding product", error);
    }
  };

  const handleFileChange = (event) => {
    setNewProduct({ ...newProduct, picture: event.target.files[0] });
  };

  return (
    <div className="admin-wrapper">
      <h2 className="admin-title">Admin Dashboard</h2>

      <div className="admin-nav-links">
        <Link to="/UsersList" className="admin-btn-link">
          Users List
        </Link>
        <Link to="/ProductsManagement" className="admin-btn-link">
          Products
        </Link>
        <Link to="/OrdersManagement" className="admin-btn-link">
          Orders
        </Link>
        <Link to="/payments" className="admin-btn-link">
          Payments
        </Link>
      </div>

      <h3 className="admin-subtitle">Add New Product</h3>

      <div className="admin-form-group">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="admin-input"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: e.target.value })
          }
          className="admin-input"
        />
        <input
          type="number"
          placeholder="Price per kg"
          value={newProduct.pricePerKg}
          onChange={(e) =>
            setNewProduct({ ...newProduct, pricePerKg: e.target.value })
          }
          className="admin-input"
        />
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="admin-file-input"
        />
        <button 
          onClick={handleAddProduct}
          className="admin-add-btn"
        >
          Add Product
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AdminDashboard;