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
import NotFound from "./components/NotFound";
import "./index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [isAuthenticated]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLoginSuccess = (user) => {
    // console.log("Logged in user:", user);
    setIsAuthenticated(true);
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && notFound && (
          <Header
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            onLogout={() => setIsAuthenticated(false)}
          />
        )}
        <div
          className={
            isAuthenticated
              ? "flex-grow p-8 overflow-auto bg-[#f7f9fc]"
              : "flex-grow"
          }
        >
          <Routes>
            {!isAuthenticated ? (
              <Route
                path="*"
                element={<Login onLoginSuccess={handleLoginSuccess} />}
              />
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute setNotFound={setNotFound}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute setNotFound={setNotFound}>
                      <ManageBooks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute setNotFound={setNotFound}>
                      <ManageUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/authors"
                  element={
                    <ProtectedRoute setNotFound={setNotFound}>
                      <ManageAuthors />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute setNotFound={setNotFound}>
                      <ManageCategories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute setNotFound={setNotFound}>
                      <ManageReviews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="*"
                  element={<NotFound setNotFound={setNotFound} />}
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
