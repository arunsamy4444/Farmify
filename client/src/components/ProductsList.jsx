import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Show the Render/static products warning toast
        toast.warning(
            <div>
                <p>⚠️ <strong>Note:</strong> This app is hosted on Render (free tier)</p>
                <p>Due to platform limitations:</p>
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li>• Image upload & fetching are disabled</li>
                    <li>• Products are shown as static demo items</li>
                </ul>
                <p style={{ marginTop: '10px' }}>
                    💻 For the full experience, run it locally.
                </p>
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
                position: 'top-right',
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
                style: {
                    background: '#112240',
                    border: '1px solid #64ffda',
                    borderRadius: '6px',
                }
            }
        );

        // Static fallback product list
        const staticProducts = [
            {
                _id: "1",
                name: "Tomatoes",
                picture: "/images/tom.jpg",
                pricePerKg: 25,
                quantity: 100,
            },
            {
                _id: "2",
                name: "Onions",
                picture: "/images/oni.jpg",
                pricePerKg: 20,
                quantity: 200,
            },
            {
                _id: "3",
                name: "Potatoes",
                picture: "/images/pot.jpg",
                pricePerKg: 30,
                quantity: 150,
            },
            {
                _id: "4",
                name: "Brinjal",
                picture: "/images/bri.jpg",
                pricePerKg: 40,
                quantity: 120,
            },
        ];

        setProducts(staticProducts);
        setLoading(false);

        // Optional: Try to fetch real products if available
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/products`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.products && response.data.products.length > 0) {
                    setProducts(response.data.products);
                    toast.success("Products loaded successfully!");
                }
            } catch (err) {
                // Use static products if fetch fails
                console.error("Failed to fetch products, using static data", err);
            }
        };
        fetchProducts();
    }, []);

    const handleEditProduct = async (productId) => {
        const name = prompt("Enter new product name:");
        const quantity = prompt("Enter new product quantity:");
        const pricePerKg = prompt("Enter price per kg:");

        if (name && quantity && pricePerKg) {
            try {
                await axios.put(
                    `${process.env.REACT_APP_BASE_URL}/admin/editproducts/${productId}`,
                    { name, quantity, pricePerKg },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                toast.success("Product updated successfully");
                setProducts(products.map((product) =>
                    product._id === productId ? { ...product, name, quantity, pricePerKg } : product
                ));
            } catch (error) {
                toast.error("Error updating product");
                console.error("Error updating product", error);
            }
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(
                    `${process.env.REACT_APP_BASE_URL}/admin/deleteproducts/${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                toast.success("Product deleted successfully");
                setProducts(products.filter((product) => product._id !== productId));
            } catch (error) {
                toast.error("Error deleting product");
                console.error("Error deleting product", error);
            }
        }
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Product List</h2>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                    <li key={product._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                        <img
                            src={product.picture || "https://via.placeholder.com/150?text=No+Image"}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600">Quantity: {product.quantity}</p>
                        <p className="text-gray-600">Price: ₹{product.pricePerKg}/kg</p>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleEditProduct(product._id)}
                                className="flex-1 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductsList;
