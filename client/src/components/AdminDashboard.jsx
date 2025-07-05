import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    pricePerKg: 0,
    picture: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  // Static fallback product list
  const staticProducts = [
    {
      _id: "1",
      name: "Tomatoes",
      picture: "/tom.jpg",
      pricePerKg: 25,
      quantity: 100,
    },
    {
      _id: "2",
      name: "Onions",
      picture: "/oni.jpg",
      pricePerKg: 20,
      quantity: 200,
    },
    {
      _id: "3",
      name: "Potatoes",
      picture: "s/pot.jpg",
      pricePerKg: 30,
      quantity: 150,
    },
    {
      _id: "4",
      name: "Brinjal",
      picture: "/bri.jpg",
      pricePerKg: 40,
      quantity: 120,
    },
  ];

  useEffect(() => {
    // Show the Render/static products warning toast on component mount
    toast.warning(
      <div>
        <p>⚠️ <strong>Note:</strong> This app is hosted on Render (free tier)</p>
        <p>Due to platform limitations:</p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>• Image upload & fetching are disabled</li>
          <li>• Products are shown as static demo items</li>
        </ul>
        <p style={{ marginTop: "10px" }}>💻 For the full experience, run it locally.</p>
        <p>
          🖥️ Contact me for live localhost screen sharing:
          <br />
          🔗{" "}
          <a
            href="https://arunsamy.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#64ffda",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            arunsamy.vercel.app
          </a>
        </p>
      </div>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#112240",
          border: "1px solid #64ffda",
          borderRadius: "6px",
        },
      }
    );

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [usersRes, ordersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getallusers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getorders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersRes.data.users);
        setOrders(ordersRes.data.orders);
      } catch (error) {
        toast.error("Error fetching dashboard data.");
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddProduct = async () => {
    const { name, quantity, pricePerKg, picture } = newProduct;

    if (!name || !quantity || !pricePerKg || !picture) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("pricePerKg", pricePerKg);
    formData.append("picture", picture);

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/products/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product added successfully!");
      setNewProduct({
        name: "",
        quantity: 0,
        pricePerKg: 0,
        picture: null,
      });
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewProduct({ ...newProduct, picture: file });

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const showProductToast = (e) => {
    e.preventDefault();
    toast.warning(
      <div>
        <p>
          ⚠️ <strong>Note:</strong> This app is hosted on Render (free tier)
        </p>
        <p>Due to platform limitations:</p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>• Image upload & fetching are disabled</li>
          <li>• Products are shown as static demo items</li>
        </ul>
        <p style={{ marginTop: "10px" }}>💻 For the full experience, run it locally.</p>
        <p>
          🖥️ Contact me for live localhost screen sharing:
          <br />
          🔗{" "}
          <a
            href="https://arunsamy.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#64ffda",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            arunsamy.vercel.app
          </a>
        </p>
      </div>,
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: "#112240",
          border: "1px solid #64ffda",
          borderRadius: "6px",
        },
      }
    );
    
    // Navigate after showing the toast
    setTimeout(() => {
      navigate("/ProductsManagement");
    }, 100);
  };

  return (
    <div className="admin-wrapper">
      <h2 className="title">Admin Dashboard</h2>

      <div className="nav-links">
        <Link to="/UsersList" className="btn-link">
          Users List
        </Link>
        {/* <Link to="/ProductsManagement" className="btn-link" onClick={showProductToast}>
          Products
        </Link> */}
        <Link to="/OrdersManagement" className="btn-link">
          Orders
        </Link>
        <Link to="/payments" className="btn-link">
          Payments
        </Link>
      </div>

      <h3 className="subtitle">Add New Product</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price per kg"
          value={newProduct.pricePerKg}
          onChange={(e) => setNewProduct({ ...newProduct, pricePerKg: e.target.value })}
        />
        <input type="file" onChange={handleFileChange} />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        )}
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <h3 className="subtitle">Static Products Preview</h3>
      <div className="product-grid">
        {staticProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={product.picture}
              alt={product.name}
              className="product-image"
              onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
            />
            <h4>{product.name}</h4>
            <p>Qty: {product.quantity}</p>
            <p>₹{product.pricePerKg}/kg</p>
          </div>
        ))}
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <style>{`
        .admin-wrapper {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .title {
          text-align: center;
          font-size: 26px;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .nav-links {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn-link {
          padding: 10px 15px;
          background-color: #22c55e;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: background 0.3s ease;
        }

        .btn-link:hover {
          background-color: #16a34a;
        }

        .subtitle {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 25px 0 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group button {
          background-color: #7c3aed;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .form-group button:hover {
          background-color: #6d28d9;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .product-card {
          border: 1px solid #eee;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          background: #fafafa;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .product-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
