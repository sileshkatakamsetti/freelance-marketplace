import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import GigDetails from "./pages/GigDetails";
import ChatPage from "./pages/ChatPage";

import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AdminManagement from "./pages/AdminManagement";
import AdminGigs from "./pages/AdminGigs";
import AdminOrders from "./pages/AdminOrders";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* USER DASHBOARDS */}
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* ADMIN MANAGEMENT */}
        <Route path="/dashboard/admin/manage" element={<AdminManagement />} />
        <Route path="/dashboard/admin/gigs" element={<AdminGigs />} />
        <Route path="/dashboard/admin/orders" element={<AdminOrders />} />

        {/* OTHER PAGES */}
        <Route path="/gig/:id" element={<GigDetails />} />
        <Route path="/chat/:orderId" element={<ChatPage />} />

        {/* 404 */}
        <Route path="*" element={<p>Page Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
