import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
      .get("http://localhost:5000/buyer/getallproducts")
      .then((response) => setProducts(response.data.products))
      .catch((error) =>  toast.error("Error fetching products"));

    axios
      .get(`http://localhost:5000/buyer/getorder/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setOrders(response.data.orders || []))
      .catch((error) =>toast.error("Error fetching orders"));
  }, [userId]);

  const getImageUrl = (picture) =>
    picture
      ? picture.startsWith("http")
        ? picture
        : `http://localhost:5000/uploads/${picture}`
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
    console.log("Selected Orders:", selectedOrders); // Debugging line
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
      totalPrice: order.product?.pricePerKg * order.quantity, // Calculate total price per order item
      address,
    }));
    
    console.log("Order Data to be sent:", orderData); // Debugging line
    
    axios
      .post(
        "http://localhost:5000/buyer/placeorder",
        { orderItems: orderData, address, targetName: "Default Target"  },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        toast.success("Order placed successfully");
         // Calculate the total order price
        const totalOrderPrice = orderData.reduce((sum, item) => sum + item.totalPrice, 0);

        setOrders([...orders, response.data.order]);
        setSelectedOrders([]);
        setOrderId(response.data.order._id);
         // Navigate to payment page with total price included
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
  
    // Calculate total price for selected orders
    const totalOrderPrice = selectedOrders.reduce(
      (sum, item) => sum + item.product.pricePerKg * item.quantity,
      0
    );
  
    navigate(`/payment/${userId}/${orderId}?total=${totalOrderPrice}`);
  };
  
  // const goToPayment = () => {
  //   if (!orderId || !userId) {
  //     alert("No order found for payment");
  //     return;
  //   }
  //   navigate(`/payment/${userId}/${orderId}`);
  // };

  return (
    <div className="dashboard">
       <ToastContainer position="top-right" autoClose={3000} />
<h1 className="text-4xl font-bold text-gray-900 text-center mt-6 mb-8">Buyer Dashboard</h1>

      {/* Product List */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Products</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
  {products.map((product) => (
    <div
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
      key={product._id}
    >
      <img
        className="w-full h-48 object-cover rounded-md"
        src={getImageUrl(product.picture)}
        alt={product.name}
        onError={(e) => (e.target.src = "default-image-path.jpg")}
      />
      <h3 className="text-xl font-semibold text-gray-800 mt-4">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-2">Available: {product.quantity}</p>
      <p className="text-sm text-gray-800 font-semibold mt-2">Price: ₹{product.pricePerKg} per kg</p>
      <button
        className="w-full mt-4 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() => selectProduct(product)}
      >
        Order
      </button>
    </div>
  ))}
</div>


      {/* Order Form */}
      {selectedOrders.length > 0 && (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg mx-auto">
    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Order</h3>
    {selectedOrders.map((item) => (
      <div
        key={item.product._id}
        className="flex items-center justify-between p-4 bg-gray-100 rounded-md mb-3 shadow-sm"
      >
        <p className="text-gray-800 font-medium">{item.product.name}</p>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
          min="1"
          className="w-16 p-2 border border-gray-300 rounded-md text-center"
        />
        <button
          className="text-red-500 font-semibold hover:text-red-700 transition"
          onClick={() => removeProduct(item.product._id)}
        >
          Remove
        </button>
      </div>
    ))}

    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Enter Address</h3>
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Taluk"
        value={address.taluk}
        onChange={(e) => setAddress({ ...address, taluk: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        placeholder="District"
        value={address.district}
        onChange={(e) => setAddress({ ...address, district: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        placeholder="Pincode"
        value={address.pincode}
        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
      />
      <input
        type="text"
        placeholder="Village/Town"
        value={address.villageTown}
        onChange={(e) => setAddress({ ...address, villageTown: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
      />
    </div>

    <button
      className="w-full mt-6 bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition"
      onClick={placeOrder}
    >
      Place Order
    </button>
  </div>
)}


{orderId && (
  <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Order ID: <span className="text-blue-600">{orderId}</span></h2>
    <button 
      className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
      onClick={goToPayment}
    >
      Proceed to Payment
    </button>
  </div>
)}

    </div>
  );
};

export default BuyerDashboard;

