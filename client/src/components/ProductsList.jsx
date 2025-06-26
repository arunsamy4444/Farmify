import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
          toast.info("Fetching products...");
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/products`)
                setProducts(response.data.products);
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

    return (   <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Product List</h2>
        <ToastContainer position="top-right" autoClose={3000} />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
                <li key={product._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                    <img
                        src={product.picture}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
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



