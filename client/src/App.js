import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage'; 
import AdminDashboard from './components/AdminDashboard'; 
import BuyerDashboard from './components/BuyerDashboard'; 
import Payment from './components/Payment';
import MapComponent from './components/MapComponent';
import './App.css';
import UsersList from './components/UserLIst';
import ProductsList from './components/ProductsList';
import OrdersList from './components/OrdersList';
import Orders from './components/Orders';
import Navbar from './components/Navbar';
import PaymentList from "./components/PaymentList"; // Import Payment Component

const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
           
                {/* Route for the AuthPage (Login/Signup) */}
                <Route path="/" element={<AuthPage />} />

                {/* Route for Home Page with buttons */}
                <Route path="/home" element={<HomePage />} />

                {/* Routes for each database page */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                <Route path="/UsersList" element={<UsersList />} />
                <Route path="/ProductsManagement" element={<ProductsList />} />
                <Route path="/OrdersManagement" element={<OrdersList />} />
                <Route path="/Orders" element={<Orders />} />
                <Route path="payments" element={<PaymentList />} /> {/* Add Payment List Route */}
                
                <Route path="/payment/:userId/:orderId" element={<Payment />} />
                
                {/* Route for MapComponent */}
                <Route path="/map" element={<MapComponent />} />
            </Routes>
        </Router>
    );
};

export default App;




// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AuthPage from './components/AuthPage';
// import HomePage from './components/HomePage'; 
// import AdminDashboard from './components/AdminDashboard'; 
// import BuyerDashboard from './components/BuyerDashboard'; 
// import Payment from './components/Payment';
// import './App.css'
// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 {/* Route for the AuthPage (Login/Signup) */}
//                 <Route path="/" element={<AuthPage />} />

//                 {/* Route for Home Page with buttons */}
//                 <Route path="/home" element={<HomePage />} />

//                 {/* Routes for each database page */}
//                 <Route path="/admin-dashboard" element={<AdminDashboard />} />
//                 <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                
//                 <Route path="/payment/:userId/:orderId" element={<Payment />} />
//             </Routes>
//         </Router>
//     );
// };

// export default App;
