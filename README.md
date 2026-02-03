```markdown
# 🌱 Farmify - Farm Fresh Produce Marketplace

A full-stack MERN application connecting farmers directly with consumers for fresh, organic produce.


## ✨ Features

### 👥 User Features
- **Authentication & Authorization** with JWT
- **Browse Products** - View available farm produce
- **Place Orders** - Select products and quantities
- **Address Management** - Enter delivery details
- **Secure Payments** - Integrated payment system
- **Order History** - Track previous orders

### 👨‍💼 Admin Features
- **User Management** - View all registered users
- **Product Management** - Add, edit, delete products
- **Order Management** - View and update order status
- **Payment Tracking** - Monitor successful transactions
- **Image Upload** - Add product pictures

## 🛠️ Tech Stack

- **Frontend:** React, CSS, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer
- **Hosting:** Vercel (Frontend), Render (Backend)
- **Database:** MongoDB Atlas

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/arunsamy4444/Farmify.git

# Install dependencies
cd client && npm install
cd ../server && npm install

# Environment setup
# Add .env files with required variables
```

## 🔧 Environment Variables

### Frontend (.env)
```env
REACT_APP_BASE_URL=your_backend_url
```

### Backend (.env)
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 🎯 Key Functionalities

- **Role-based Access Control** (Admin/User)
- **Image Upload & Management**
- **RESTful API Architecture**
- **Responsive Design**
- **Real-time Order Updates**
- **Secure Payment Processing**

## 📱 Usage

1. **Users** can sign up, browse products, and place orders
2. **Admins** can manage inventory, users, and orders
3. **Secure authentication** protects user data
4. **Mobile-responsive** design for all devices

---

*Connecting Farmers & Consumers Directly 🌾*
```
