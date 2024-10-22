/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaBook, FaUsers, FaUserCircle, FaBoxes } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import NotificationDrawer from "./NotificationDrawer";

const Header = ({ toggleSidebar, sidebarOpen, onLogout }) => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/");
  };

  const toggleDrawer = async () => {
    setIsDrawerOpen(!isDrawerOpen);

    // Fetch messages when drawer is opened
    if (!isDrawerOpen) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://book-store-backend-sigma-one.vercel.app/contact",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    }
  };

  // Delete function for messages
  const handleDelete = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://book-store-backend-sigma-one.vercel.app/contact/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setMessages(messages.filter((message) => message._id !== messageId));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  return (
    <>
      <div
        className={`w-64 h-screen shadow-lg fixed top-0 left-0 bg-white lg:static lg:w-auto lg:flex lg:flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex lg:flex-col items-center justify-between w-full p-4 lg:p-0">
          <Link to="/admin" className="mx-4 lg:mx-10">
            <img
              src={"/logo-removebg.png"}
              alt="logo"
              className="w-24 lg:w-55 h-16 lg:h-24"
            />
          </Link>
        </div>

        {/* Sidebar Menu Links */}
        <nav className="flex flex-col font-semibold text-2xl text-orange-900 mt-6 gap-12">
          <Link to="/admin/books" className="flex items-center gap-2 px-4 py-2">
            <FaBook /> <span>Books</span>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2">
            <FaUsers /> <span>Users</span>
          </Link>
          <Link
            to="/admin/authors"
            className="flex items-center gap-2 px-4 py-2"
          >
            <FaUserCircle /> <span>Authors</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-2 px-4 py-2"
          >
            <FaBoxes /> <span>Categories</span>
          </Link>
        </nav>
      </div>

      {/* Header with Notification Icon and Logout */}
      <div className="flex items-center justify-between fixed top-4 right-4 w-full lg:w-auto px-5 bg-white lg:bg-transparent">
        <button
          onClick={toggleSidebar}
          className="lg:hidden btn btn-square btn-ghost"
        >
          {sidebarOpen ? "Close" : "Menu"}
        </button>

        <div className="flex items-center space-x-4">
          {/* Notification Icon - Separate from User Dropdown */}
          <button className="btn btn-square btn-ghost" onClick={toggleDrawer}>
            <IoIosNotificationsOutline className="text-3xl" />
          </button>

          {/* User Icon with Logout in Dropdown */}
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

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        messages={messages}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default Header;
