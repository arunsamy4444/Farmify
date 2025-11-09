import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ProductsList.css";

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            toast.info("Fetching products...");
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/products`)
                setProducts(response.data.products || []);
                toast.success("Products loaded successfully!");
            } catch (err) {
                setError('Failed to fetch products');
                toast.error("Failed to fetch products");
            } finally {
                setLoading(false);
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
                    `${process.env.REACT_APP_BASE_URL}/admin/editproduct/${productId}`, // ✅ FIXED
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
                    `${process.env.REACT_APP_BASE_URL}/admin/deleteproduct/${productId}`, // ✅ FIXED
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

    const getImageUrl = (picture) => {
        if (!picture) return '/default-product.jpg';
        return picture.startsWith('http') ? picture : `${process.env.REACT_APP_BASE_URL}/uploads/${picture}`;
    };

    if (loading) return <div className="products-list-loading">Loading products...</div>;
    if (error) return <div className="products-list-error">{error}</div>;

    return (
        <div className="products-list-container">
            <h2 className="products-list-title">Product Management</h2>
            <ToastContainer position="top-right" autoClose={3000} />

            {products.length === 0 ? (
                <div className="products-list-empty">
                    No products found. Add some products to get started.
                </div>
            ) : (
                <div className="products-list-grid">
                    {products.map((product) => (
                        <div key={product._id} className="products-list-card">
                            <div className="products-list-image-container">
                                <img
                                    src={getImageUrl(product.picture)}
                                    alt={product.name}
                                    className="products-list-image"
                                    onError={(e) => {
                                        e.target.src = '/default-product.jpg';
                                    }}
                                />
                            </div>
                            <div className="products-list-content">
                                <h3 className="products-list-name">{product.name}</h3>
                                <div className="products-list-details">
                                    <p className="products-list-quantity">
                                        <span className="products-list-label">Quantity:</span>
                                        {product.quantity} kg
                                    </p>
                                    <p className="products-list-price">
                                        <span className="products-list-label">Price:</span>
                                        ₹{product.pricePerKg}/kg
                                    </p>
                                </div>
                                <div className="products-list-actions">
                                    <button
                                        onClick={() => handleEditProduct(product._id)}
                                        className="products-list-edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="products-list-delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsList;