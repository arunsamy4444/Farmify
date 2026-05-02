# Farmify - Agricultural Supply Chain Management Prototype

A full-stack MERN prototype that models product flow, order processing, and role-based transaction control in small-scale agricultural supply chain environments.

---

## System Context

In small agricultural distribution networks, product movement is often tracked through paper logs, messaging apps, or disconnected spreadsheets. This creates inconsistencies in inventory visibility, order tracking, and transaction history.

Farmify models a simplified digital supply chain pipeline:

product catalog → order creation → transaction record → role-based state management

The focus is on structured data flow rather than e-commerce functionality.

---

## Core Capabilities

### User Layer
- JWT-based authentication with encrypted credentials (bcrypt)
- Browse and filter product inventory
- Create orders with quantity-based selection
- Maintain delivery address records
- Track order status and history

### Administrative Layer
- Centralized product and inventory management
- Order lifecycle control (pending → processing → delivered)
- User management and access control
- Image-based product entry using file uploads

---

## System Design Behavior

- Products are stored as structured inventory records in MongoDB
- Orders generate immutable transaction entries linked to users
- Admin actions directly update order state transitions
- Role-Based Access Control (RBAC) separates operational privileges
- System maintains a consistent mapping between users, products, and transactions

---

## Design Intent

This system is not a commercial e-commerce platform. It is a **workflow simulation of agricultural supply chain digitization**.

Key design decisions:
- MongoDB chosen for flexible schema modeling of product/order structures
- RBAC implemented to simulate real-world operational hierarchies
- Transaction-based order tracking instead of stateless cart systems
- Separation of user and admin flows to reflect real operational boundaries

---

## Execution Flow

1. Admin creates and manages product inventory
2. User browses available products
3. User places an order with structured metadata
4. System creates a transaction record in MongoDB
5. Admin updates order state through lifecycle stages
6. User tracks order progression in real-time dashboard

---

## Tech Stack

Frontend: React, React Router, Axios, CSS  
Backend: Node.js, Express  
Database: MongoDB (Atlas)  
Authentication: JWT, bcrypt  
File Handling: Multer  
Deployment: Vercel (Frontend), Render (Backend)

---

## Limitations

- No real payment gateway integration
- No distributed inventory synchronization system
- No supply-demand prediction or optimization layer
- Designed as a single-node prototype system (no microservices architecture)
- Backend may experience cold starts due to free-tier hosting

---

## Use Case

Designed for small agricultural distributors or cooperatives where:

- Product tracking is manually maintained
- Order processing lacks structured lifecycle tracking
- Transaction history is fragmented or inconsistent
- Lightweight digitization is preferred over enterprise ERP systems

---

## Summary

Farmify is a **supply chain workflow simulation system** focused on digitizing product movement, order lifecycle management, and role-based transaction control in constrained operational environments.
