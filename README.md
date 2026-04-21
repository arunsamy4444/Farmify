# Farmify - Agricultural Supply Chain System

A full-stack MERN system for managing product flow, transactions, and user roles in small-scale agricultural supply chains.

## Context

In many local agri-processing and distribution setups, product movement and transactions are tracked manually or across disconnected systems. This leads to poor visibility, delays, and inconsistent records.

This system models a basic structure:
product listing → order placement → transaction tracking → role-based management.

## Features

### User
- Authentication (JWT-based)
- Browse available products
- Place orders with quantity selection
- Manage delivery address
- View order history

### Admin
- Manage users
- Add, update, delete products
- Track and update order status
- Monitor payments
- Upload product images

## System Behavior

- Products are listed and stored in a centralized database
- Orders create structured transaction records
- Admin controls inventory and order flow
- Users interact through a controlled interface with role-based access

## Use Case

A small agricultural distributor or group can:
- Digitize product listings and availability
- Track incoming orders in a structured way
- Maintain transaction records instead of manual logs
- Manage operations through a centralized system

This reduces reliance on fragmented record-keeping and improves visibility of product flow.

## Tech Stack

Frontend: React, CSS, React Router, Axios  
Backend: Node.js, Express  
Database: MongoDB (Atlas)  
Auth: JWT, bcrypt  
File Upload: Multer  
Hosting: Vercel (frontend), Render (backend)

## Notes

- Designed as a prototype for supply chain digitization
- Focused on core transaction and role management flows
- Deployed on free-tier services; backend may experience cold starts due to inactivity
