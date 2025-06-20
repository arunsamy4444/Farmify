// import React from "react";
// import { useEffect } from "react";

// function Orders() {
//   const token = localStorage.getItem("token");
//   let userId = null;
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken.id;
//     } catch (error) {
//       console.error("Invalid token:", error);
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   } else {
//     navigate("/login");
//   }
//   useEffect(() => {
//     axios
//       .get(`https://ifarmify.onrender.com/buyer/getorder/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => setOrders(response.data.orders || []))
//       .catch((error) => console.error("Error fetching orders:", error));
//   }, [userId]);

//   return (
//     <div>
//       <h2 className="text-4xl font-bold text-gray-900 text-center mt-6 mb-8">
//         Your Orders
//       </h2>
//       {orders.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-12">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
//             >
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Order ID: {order._id}
//               </h3>
//               <p className="text-sm text-gray-600 mt-1">
//                 <span className="font-medium">Status:</span> {order.status}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">
//                 <span className="font-medium">Address:</span>{" "}
//                 {order.address.taluk}, {order.address.district},{" "}
//                 {order.address.pincode}, {order.address.villageTown}
//               </p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No orders placed yet.</p>
//       )}
//     </div>
//   );
// }

// export default Orders;
