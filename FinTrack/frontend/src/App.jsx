import React, { useState, useEffect } from "react";
import { BrowserRouter as Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Features from "./pages/Features";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Budget from "./pages/Budget";
import Report from "./pages/Report";
import Savings from "./pages/Savings";
import Settings from "./pages/Settings";
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider
import Premium from "./pages/Premium";
import PaymentPage from "./pages/PaymentPage";

const App = () => {
  const [token, setToken] = useState(null); 

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div className="App">
      {/* Wrap the entire app with AuthProvider */}
      <AuthProvider>
        <Routes>
          {!token ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="/signup" element={<Signup setToken={setToken} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard setToken={setToken} />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/income" element={<Income />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/report" element={<Report />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
