import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import ManageBooks from './components/ManageBooks';
import ManageUsers from './components/ManageUsers';
import ManageAuthores from './components/ManageAuthores';
import ManageCategories from "./components/ManageCategories";

import Header from "./components/Header";

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="flex">
        <Header/>

        <div className="flex-grow p-6">
          <Routes>
        {/* Login Route */}
        {/* <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} /> */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/books" element={<ManageBooks />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/authors" element={<ManageAuthores />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
           
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
