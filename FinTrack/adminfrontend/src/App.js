import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Usermanagement from "./pages/Usermanagement";
import Analytics from "./pages/Analytics";
import Sidebar from "./Components/Sidebar";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function App() {
  return (
    <>
    
      
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<Usermanagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        
   
       
      </Routes>
    </>
  );
}

export default App;
       