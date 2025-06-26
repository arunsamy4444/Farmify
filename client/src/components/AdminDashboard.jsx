import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    pricePerKg: 0,
    picture: null,
  });

  // ✅ Utility for displaying images
  const getImageUrl = (picture) =>
    picture
      ? picture.startsWith("http")
        ? picture
        : `${process.env.REACT_APP_BASE_URL}/uploads/${picture}`
      : "default-image-path.jpg";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getallusers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BASE_URL}/admin/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getorders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersRes.data.users);
        setProducts(productsRes.data.products);
        setOrders(ordersRes.data.orders);
      } catch (error) {
        toast.error("Error fetching dashboard data");
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/editorders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Order status updated");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleAddProduct = async () => {
    const { name, quantity, pricePerKg, picture } = newProduct;

    if (!name || !quantity || !pricePerKg || !picture) {
      alert("Please fill all fields");
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

      toast.success("Product added");
      setProducts((prev) => [...prev, response.data.product]);
      setNewProduct({
        name: "",
        quantity: 0,
        pricePerKg: 0,
        picture: null,
      });
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  const handleFileChange = (event) => {
    setNewProduct({ ...newProduct, picture: event.target.files[0] });
  };

  return (
    <div className="admin-wrapper">
      <h2 className="title">Admin Dashboard</h2>

      <div className="nav-links">
        <Link to="/UsersList" className="btn-link">Users List</Link>
        <Link to="/ProductsManagement" className="btn-link">Products</Link>
        <Link to="/OrdersManagement" className="btn-link">Orders</Link>
        <Link to="/payments" className="btn-link">Payments</Link>
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
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <h3 className="subtitle">Product List</h3>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={getImageUrl(product.picture)}
              alt={product.name}
              className="product-image"
              onError={(e) => (e.target.src = "default-image-path.jpg")}
            />
            <h4>{product.name}</h4>
            <p>Qty: {product.quantity}</p>
            <p>₹{product.pricePerKg}/kg</p>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <style>{`
        .admin-wrapper {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          animation: fadeIn 0.5s ease-in-out;
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     quantity: 0,
//     price: 0,
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//       "Content-Type": "multipart/form-data",
//     },
//     pricePerKg: 0,
//     picture: null,
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // AFTER
//         const usersResponse = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/admin/getallusers`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setUsers(usersResponse.data.users);

//         // AFTER
//         const productsResponse = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/admin/products`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setProducts(productsResponse.data.products);

//         // AFTER
//         const ordersResponse = await axios.get(
//           `${process.env.REACT_APP_BASE_URL}/admin/getorders`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setOrders(ordersResponse.data.orders);
//       } catch (error) {
//         toast.error("Error fetching dashboard data");
//         console.error("Error fetching dashboard data", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const handleEditOrderStatus = async (orderId, status) => {
//     try {
//       // AFTER
//       const response = await axios.put(
//         `${process.env.REACT_APP_BASE_URL}/admin/editorders/${orderId}`,

//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success("Order status updated successfully");

//       const updatedOrders = orders.map((order) =>
//         order._id === orderId ? { ...order, status } : order
//       );
//       setOrders(updatedOrders);
//     } catch (error) {
//       toast.error("Error updating order status");
//       console.error("Error updating order status", error);
//     }
//   };

//   const handleAddProduct = async () => {
//     const { name, quantity, pricePerKg, picture } = newProduct;

//     if (!name || !quantity || !pricePerKg || !picture) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("quantity", quantity);
//     formData.append("pricePerKg", pricePerKg);
//     formData.append("picture", picture);

//     try {
//       // AFTER
//       const response = await axios.post(
//         `${process.env.REACT_APP_BASE_URL}/admin/products/add`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success("Product added successfully");
//       setProducts([...products, response.data.product]);

//       setNewProduct({
//         name: "",
//         quantity: 0,
//         pricePerKg: 0,
//         picture: null,
//       });
//     } catch (error) {
//       toast.error("Error adding product");
//       console.error("Error adding product", error);
//     }
//   };

//   const handleFileChange = (event) => {
//     setNewProduct({ ...newProduct, picture: event.target.files[0] });
//   };

//   return (
//     <div className="admin-wrapper">
//       <h2 className="title">Admin Dashboard</h2>

//       <div className="nav-links">
//         <Link to="/UsersList" className="btn-link">
//           Users List
//         </Link>
//         <Link to="/ProductsManagement" className="btn-link">
//           Products
//         </Link>
//         <Link to="/OrdersManagement" className="btn-link">
//           Orders
//         </Link>
//         <Link to="/payments" className="btn-link">
//           Payments
//         </Link>
//       </div>

//       <h3 className="subtitle">Add New Product</h3>

//       <div className="form-group">
//         <input
//           type="text"
//           placeholder="Product Name"
//           value={newProduct.name}
//           onChange={(e) =>
//             setNewProduct({ ...newProduct, name: e.target.value })
//           }
//         />
//         <input
//           type="number"
//           placeholder="Quantity"
//           value={newProduct.quantity}
//           onChange={(e) =>
//             setNewProduct({ ...newProduct, quantity: e.target.value })
//           }
//         />
//         <input
//           type="number"
//           placeholder="Price per kg"
//           value={newProduct.pricePerKg}
//           onChange={(e) =>
//             setNewProduct({ ...newProduct, pricePerKg: e.target.value })
//           }
//         />
//         <input type="file" onChange={handleFileChange} />
//         <button onClick={handleAddProduct}>Add Product</button>
//       </div>

//       <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

//       <style>{`
//         .admin-wrapper {
//           max-width: 600px;
//           margin: 40px auto;
//           padding: 30px;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//           animation: fadeIn 0.5s ease-in-out;
//         }

//         .title {
//           text-align: center;
//           font-size: 26px;
//           color: #2c3e50;
//           margin-bottom: 20px;
//         }

//         .nav-links {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 25px;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .btn-link {
//           padding: 10px 15px;
//           background-color: #22c55e;
//           color: white;
//           border-radius: 6px;
//           text-decoration: none;
//           font-weight: 500;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.1);
//           transition: background 0.3s ease;
//         }

//         .btn-link:hover {
//           background-color: #16a34a;
//         }

//         .subtitle {
//           font-size: 18px;
//           font-weight: 600;
//           color: #333;
//           margin-bottom: 10px;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 15px;
//         }

//         .form-group input[type="text"],
//         .form-group input[type="number"],
//         .form-group input[type="file"] {
//           padding: 10px;
//           border: 1px solid #ccc;
//           border-radius: 6px;
//           font-size: 14px;
//         }

//         .form-group button {
//           background-color: #7c3aed;
//           color: white;
//           padding: 10px;
//           border: none;
//           border-radius: 6px;
//           font-weight: 600;
//           cursor: pointer;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//           transition: background 0.3s ease;
//         }

//         .form-group button:hover {
//           background-color: #6d28d9;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @media (max-width: 600px) {
//           .admin-wrapper {
//             padding: 20px;
//           }

//           .nav-links {
//             flex-direction: column;
//             gap: 12px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminDashboard;
