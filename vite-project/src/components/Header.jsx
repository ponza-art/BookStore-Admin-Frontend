import React, { useEffect, useState } from "react";
import { FaBook, FaUsers, FaUserCircle, FaBoxes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { IoIosNotificationsOutline } from "react-icons/io";

const Header = ({ toggleSidebar, sidebarOpen, theme }) => {
  const [localTheme, setLocalTheme] = useState(theme);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", localTheme);
    localStorage.setItem("theme", localTheme);
  }, [localTheme]);

  const toggleTheme = () => {
    setLocalTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div
        className={`w-64 h-screen shadow-lg fixed top-0 left-0 bg-white lg:static lg:w-auto lg:flex lg:flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="flex lg:flex-col items-center justify-between w-full p-4 lg:p-0">
          <Link to="/admin" className="mx-4 lg:mx-10">
            <img src={"/logo-removebg.png"} alt="logo" className="w-24 lg:w-60 h-16 lg:h-24" />
          </Link>
        </div>

        {/* Sidebar Menu Links */}
        <nav className="flex flex-col font-semibold text-2xl text-orange-900 mt-6 gap-12">
          <Link to="/admin/books" className="flex items-center gap-2 px-4 py-2">
            <FaBook /> <span>Manage Books</span>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2">
            <FaUsers /> <span>Manage Users</span>
          </Link>
          <Link to="/admin/authors" className="flex items-center gap-2 px-4 py-2">
            <FaUserCircle /> <span>Manage Authors</span>
          </Link>
          <Link to="/admin/categories" className="flex items-center gap-2 px-4 py-2">
            <FaBoxes /> <span>Manage Categories</span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center justify-between fixed top-4 right-4 w-full lg:w-auto px-5  bg-white lg:bg-transparent">
        <button
          onClick={toggleSidebar}
          className="lg:hidden btn btn-square btn-ghost"
        >
          {sidebarOpen ? 'Close' : 'Menu'}
        </button>

        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="btn btn-circle btn-ghost">
            {localTheme === "light" ? "🌙" : "☀️"}
          </button>
          <button onClick={toggleTheme} className="btn btn-circle btn-ghost">
            < IoIosNotificationsOutline  className="text-3xl" />
          </button>

          <div className="dropdown dropdown-bottom">
            <label tabIndex="0" className="btn btn-square btn-ghost">
              <FaUserCircle className="text-3xl" />
            </label>

            <ul
              tabIndex="0"
              className="dropdown-content p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
