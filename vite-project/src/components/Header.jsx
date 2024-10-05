import React, { useEffect, useState } from "react";
import { FaBook, FaUsers, FaUserCircle, FaBoxes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { IoIosNotificationsOutline } from "react-icons/io";


const Header = () => {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="flex ">
        <div className="w-auto items-center h-screen  shadow-lg flex flex-col justify-between">
          <div>
            <div>
              <Link to="/admin" className=" mx-10  ">
                <img
                  src={"logo-removebg.png"}
                  alt="logo"
                  className="w-60  h-24"
                />
              </Link>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col font-semibold text-2xl text-orange-900  mt-6 gap-12">
              <Link
                to="/admin/books"
                className="flex items-center gap-2 px-4 py-2"
              >
                <FaBook /> <span>Manage Books</span>
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-2 px-4 py-2 "
              >
                <FaUsers /> <span>Manage Users</span>
              </Link>
              <Link
                to="/admin/authors"
                className="flex items-center gap-2 px-4 py-2 "
              >
                <FaUserCircle /> <span>Manage Authors</span>
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center gap-2 px-4 py-2 "
              >
                <FaBoxes /> <span>Manage Categories</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      {/* Profile and Theme Toggle */}
      <div className="flex flex-row items-center lg:fixed top-4 right-4  px-5  p-4 ">
        {/* Profile Dropdown */}
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
        {/* Light/Dark mode toggle */}
        <button onClick={toggleTheme} className="btn  btn-circle btn-ghost  ">
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button className="bg-base-100 text-3xl">
          <Link to="/admin/books">
          <IoIosNotificationsOutline />
          </Link>
        </button>
      </div>
    </>
  );
};

export default Header;
