import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/BuyerDashboard.css";

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState({
    taluk: "",
    district: "",
    pincode: "",
    villageTown: "",
  });
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  } else {
    navigate("/login");
  }

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/buyer/getallproducts`)
      .then((response) => setProducts(response.data.products))
      .catch((error) => toast.error("Error fetching products"));

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/buyer/getorder/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setOrders(response.data.orders || []))
      .catch((error) => toast.error("Error fetching orders"));
  }, [userId, token]); // ✅ Added token to dependency array

  // ... rest of your component code remains the same
  const getImageUrl = (picture) =>
    picture
      ? picture.startsWith("http")
        ? picture
        : `${process.env.REACT_APP_BASE_URL}/uploads/${picture}`
      : "default-image-path.jpg";

  const selectProduct = (product) => {
    if (!product._id) {
      toast.error("Invalid product selection");
      return;
    }
    if (selectedOrders.some((item) => item.product._id === product._id)) {
      toast.warning("Product already selected");
      return;
    }
    setSelectedOrders([...selectedOrders, { product, quantity: 1 }]);
    toast.success("Product added to order");
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedOrders(
      selectedOrders.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedOrders(selectedOrders.filter((item) => item.product._id !== productId));
  };

  const placeOrder = () => {
    console.log("Selected Orders:", selectedOrders);
    if (
      selectedOrders.length === 0 ||
      !address.taluk ||
      !address.district ||
      !address.pincode ||
      !address.villageTown
    ) {
      toast.error("Please select a product and enter a valid address.");
      return;
    }

    const orderData = selectedOrders.map((order) => ({
      productId: order.product?._id,
      productName: order.product?.name,
      quantity: order.quantity,
      pricePerKg: order.product?.pricePerKg,
      totalPrice: order.product?.pricePerKg * order.quantity,
      address,
    }));
    
    console.log("Order Data to be sent:", orderData);
    
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/buyer/placeorder`,
        { orderItems: orderData, address, targetName: "Default Target" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        toast.success("Order placed successfully");
        const totalOrderPrice = orderData.reduce((sum, item) => sum + item.totalPrice, 0);

        setOrders([...orders, response.data.order]);
        setSelectedOrders([]);
        setOrderId(response.data.order._id);
        navigate(`/payment/${userId}/${response.data.order._id}?total=${totalOrderPrice}`);
      })
      .catch((error) => {
        console.error("Error placing order:", error.response?.data || error.message);
        toast.error("Failed to place order. Please try again.");
      });
  };

  const goToPayment = () => {
    if (!orderId || !userId) {
      alert("No order found for payment");
      return;
    }
  
    const totalOrderPrice = selectedOrders.reduce(
      (sum, item) => sum + item.product.pricePerKg * item.quantity,
      0
    );
  
    navigate(`/payment/${userId}/${orderId}?total=${totalOrderPrice}`);
  };

  return (
    <div className="buyer-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="buyer-title">Buyer Dashboard</h1>

      {/* Product List */}
      <h2 className="buyer-section-title">Products</h2>
      <div className="buyer-products-grid">
        {products.map((product) => (
          <div className="buyer-product-card" key={product._id}>
            <img
              className="buyer-product-image"
              src={getImageUrl(product.picture)}
              alt={product.name}
              onError={(e) => (e.target.src = "default-image-path.jpg")}
            />
            <h3 className="buyer-product-name">{product.name}</h3>
            <p className="buyer-product-stock">Available: {product.quantity}</p>
            <p className="buyer-product-price">Price: ₹{product.pricePerKg} per kg</p>
            <button
              className="buyer-order-btn"
              onClick={() => selectProduct(product)}
            >
              Order
            </button>
          </div>
        ))}
      </div>

      {/* Order Form */}
      {selectedOrders.length > 0 && (
        <div className="buyer-order-form">
          <h3 className="buyer-order-title">Your Order</h3>
          {selectedOrders.map((item) => (
            <div key={item.product._id} className="buyer-order-item">
              <p className="buyer-product-name">{item.product.name}</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                min="1"
                className="buyer-quantity-input"
              />
              <button
                className="buyer-remove-btn"
                onClick={() => removeProduct(item.product._id)}
              >
                Remove
              </button>
            </div>
          ))}

          <h3 className="buyer-address-title">Enter Address</h3>
          <div className="buyer-address-form">
            <input
              type="text"
              placeholder="Taluk"
              value={address.taluk}
              onChange={(e) => setAddress({ ...address, taluk: e.target.value })}
              className="buyer-address-input"
            />
            <input
              type="text"
              placeholder="District"
              value={address.district}
              onChange={(e) => setAddress({ ...address, district: e.target.value })}
              className="buyer-address-input"
            />
            <input
              type="text"
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              className="buyer-address-input"
            />
            <input
              type="text"
              placeholder="Village/Town"
              value={address.villageTown}
              onChange={(e) => setAddress({ ...address, villageTown: e.target.value })}
              className="buyer-address-input"
            />
          </div>

          <button className="buyer-place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      )}

      {orderId && (
        <div className="buyer-payment-section">
          <h2 className="buyer-order-id">
            Your Order ID: <span className="buyer-order-id-value">{orderId}</span>
          </h2>
          <button className="buyer-payment-btn" onClick={goToPayment}>
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;