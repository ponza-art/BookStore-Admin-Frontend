import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import ManageBooks from './components/ManageBooks';
import ManageUsers from './components/ManageUsers';
import ManageAuthors from './components/ManageAuthores';  
import ManageCategories from "./components/ManageCategories";
import ManageReviews from "./components/ManageReviews";
import Header from "./components/Header";
import Login from './components/Login'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import "./index.css"

function App() {
 
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); 

  const handleLoginSuccess = (user) => {

    console.log("Logged in user:", user);
  };

  return (
    <Router>
      <div className="flex">
        
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen}  />

        <div className="flex-grow p-6">
          <Routes>

            <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />


            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute>
                <ManageBooks />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/authors" element={
              <ProtectedRoute>
                <ManageAuthors />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute>
                <ManageCategories />
              </ProtectedRoute>
            } />
             <Route path="/admin/reviews" element={
              <ProtectedRoute>
                <ManageReviews />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
