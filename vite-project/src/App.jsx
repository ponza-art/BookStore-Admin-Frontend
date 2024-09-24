// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login"; // Login page
import ManageBooks from './components/ManageBooks';
import ManageUsers from './components/ManageUsers';
import ManageAuthors from './components/ManageAuthores';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute'; // Protected route HOC
import ManageCategories from "./components/ManageCategories";
import ManageOrders from "./components/ManageOrders";

function App() {
  const [user, setUser] = useState(null); // Store user info

  const handleLoginSuccess = (userData) => {
    setUser(userData); // Store user info after login
  };

  return (
    <Router>
      <Header />
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute>
              <ManageBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        /> 
        <Route
        path="/admin/authors"
        element={
          <ProtectedRoute>
            <ManageAuthors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <ManageCategories />
          </ProtectedRoute>
        }
      />
          <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <ManageOrders />
          </ProtectedRoute>
        }
      />

        {/* Other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
