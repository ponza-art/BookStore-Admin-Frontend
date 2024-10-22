/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import ManageBooks from "./components/ManageBooks";
import ManageUsers from "./components/ManageUsers";
import ManageAuthors from "./components/ManageAuthores";
import ManageCategories from "./components/ManageCategories";
import ManageReviews from "./components/ManageReviews";
import Header from "./components/Header";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false once the check is complete
  }, [isAuthenticated]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLoginSuccess = (user) => {
    console.log("Logged in user:", user);
    setIsAuthenticated(true);
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && (
          <Header
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            onLogout={() => setIsAuthenticated(false)}
          />
        )}
        <div className={isAuthenticated ? "flex-grow p-6" : "flex-grow"}>
          <Routes>
            {!isAuthenticated ? (
              <Route
                path="*"
                element={<Login onLoginSuccess={handleLoginSuccess} />}
              />
            ) : (
              <>
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
                  path="/admin/reviews"
                  element={
                    <ProtectedRoute>
                      <ManageReviews />
                    </ProtectedRoute>
                  }
                />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
