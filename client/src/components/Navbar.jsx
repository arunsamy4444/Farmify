import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-end">
        {/* Logo Section */}
        <Link to="/home" className="text-3xl font-bold text-green-800 hover:text-green-600 transition">
          FarmiFy
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link 
            to="/admin-dashboard" 
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Admin Dashboard
          </Link>
          <Link 
            to="/buyer-dashboard" 
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Buyer Dashboard
          </Link>
        </div>
        </div>
    </nav>
  );
}

export default Navbar;
