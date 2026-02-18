import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";

// AUTH
import Login from "./pages/Login";

// DASHBOARDS
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";

// ADMIN PAGES
import AdminOrders from "./pages/AdminOrders";
import AdminGigs from "./pages/AdminGigs";
import AdminManagement from "./pages/AdminManagement";
import AdminWithdrawals from "./pages/AdminWithdrawals";

// GIG + CHAT
import GigDetails from "./pages/GigDetails";
import ChatPage from "./pages/ChatPage";

// =======================
// APP CONTENT
// =======================
const AppContent = () => {
  const location = useLocation();

  // ❌ Hide Navbar on login page
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ✅ ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARDS */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/gigs" element={<AdminGigs />} />
        <Route path="/admin/users" element={<AdminManagement />} />
        <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />

        {/* GIG DETAILS + PLACE ORDER */}
        <Route path="/gigs/:id" element={<GigDetails />} />

        {/* CHAT */}
        <Route path="/chat/:orderId" element={<ChatPage />} />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<h2 style={{ padding: "30px" }}>Page Not Found</h2>}
        />
      </Routes>
    </>
  );
};

// =======================
// MAIN APP
// =======================
const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
