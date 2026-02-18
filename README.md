# Freelance Marketplace (Fiverr-like Platform)

A full-stack freelance marketplace application inspired by Fiverr, built using the MERN stack.  
The platform supports multiple user roles, secure payments, escrow-based fund handling, real-time chat, and withdrawal management.

---

## 🔧 Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS (UI refinements)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Payments
- Razorpay (Test Mode)
- Escrow-based payment flow

---

## 👤 User Roles

### Client
- Browse gigs
- Place orders
- Make secure payments
- Accept completed work

### Freelancer
- Create gigs
- Receive and complete orders
- Chat with clients
- Track earnings
- Request withdrawals

### Admin
- Manage users, gigs, and orders
- Monitor platform activity
- Release escrow payments
- Approve withdrawal requests

---

## 💼 Core Features

- User authentication with role-based access
- Separate dashboards for Client, Freelancer, and Admin
- Gig creation and browsing
- Order lifecycle management
- Real-time chat between client and freelancer
- Secure payment integration using Razorpay
- Escrow system for holding payments
- Admin-controlled fund release
- Freelancer earnings dashboard
- Withdrawal request and approval system (mock)
- UI refinements using Tailwind CSS

---

## 💰 Payment & Escrow Flow

1. Client places an order and completes payment
2. Payment is held in escrow
3. Freelancer completes and submits work
4. Client reviews and accepts the work
5. Admin releases the funds
6. Freelancer earnings are updated
7. Freelancer requests withdrawal
8. Admin approves withdrawal (mock payout)

---

## 🛠️ Installation & Setup

### Backend Setup
```bash
cd server
npm install
npm start
