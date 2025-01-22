/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaBook, FaUsers, FaUserCircle, FaBoxes } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import NotificationDrawer from "./NotificationDrawer";
import { FaComment } from "react-icons/fa";
import {
  RiMenu2Fill,
  RiCloseLargeFill,
  RiDashboard3Line,
} from "react-icons/ri";

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

    if (!isDrawerOpen) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://book-store-backend-azure-tau.vercel.app/contact",
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

  const handleDelete = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://book-store-backend-azure-tau.vercel.app/contact/${messageId}`,
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
  const logoStyle = {
    filter: "invert(1) brightness(2)",
  };

  return (
    <>
      <div
        className={`w-64 h-full lg:h-lvh shadow-lg z-10 fixed top-0 left-0 bg-[#1c2434] lg:sticky lg:w-fit px-5 lg:flex lg:flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0 overflow-auto" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div
          className={`lg:flex hidden lg:flex-col h-16 lg:h-24 items-start justify-between w-full p-4 mt-[60px] lg:mt-0 lg:p-0 duration-300 ${
            sidebarOpen ? "mb-16" : "mb-0"
          }`}
        >
          <Link to="/" className="w-32 lg:w-55 mx-4 my-auto lg:mx-10">
            <img
              src={"/logo-transparent-svg.svg"}
              alt="logo"
              style={logoStyle}
              className="w-28"
            />
          </Link>
        </div>

        <nav className="flex flex-col font-semibold text-2xl text-white lg:mt-10 mt-32 pb-6 gap-12 overflow-auto">
          <Link to="/" className="flex items-center justify-center ps-5">
            <div className="flex items-center gap-5 w-full">
              <RiDashboard3Line />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/books" className="flex items-center justify-center ps-5">
            <div className="flex items-center gap-5 w-full">
              <FaBook /> <span>Books</span>
            </div>
          </Link>
          <Link to="/users" className="flex items-center justify-center ps-5">
            <div className="flex items-center gap-5 w-full">
              <FaUsers /> <span>Users</span>
            </div>
          </Link>
          <Link to="/authors" className="flex items-center justify-center ps-5">
            <div className="flex items-center gap-5 w-full">
              <FaUserCircle /> <span>Authors</span>
            </div>
          </Link>
          <Link
            to="/categories"
            className="flex items-center justify-center ps-5"
          >
            <div className="flex items-center gap-5 w-full">
              <FaBoxes /> <span>Categories</span>
            </div>
          </Link>
          <Link to="/reviews" className="flex items-center justify-center ps-5">
            <div className="flex items-center gap-5 w-full">
              <FaComment /> <span>Reviews</span>
            </div>
          </Link>
        </nav>
      </div>

      <div className="z-20 flex items-center justify-between fixed top-0 right-0 w-full lg:me-3 lg:w-auto lg:mt-3 px-4 py-2 lg:absolute bg-white lg:rounded-full">
        <button
          onClick={toggleSidebar}
          className="lg:hidden btn btn-square btn-ghost"
        >
          {sidebarOpen ? (
            <RiCloseLargeFill size={24} />
          ) : (
            <RiMenu2Fill size={24} />
          )}
        </button>
        <Link
          to="/"
          className="lg:hidden block w-20 lg:w-55 mx-4 my-auto lg:mx-10"
        >
          <img src={"/logo-transparent-svg.svg"} alt="logo" />
        </Link>

        <div className="flex items-center justify-between space-x-4 lg:px-2">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={toggleDrawer}
          >
            <IoIosNotificationsOutline className="text-3xl" />
          </button>

          <div className="dropdown dropdown-end">
            <label
              tabIndex="0"
              className="btn btn-sm btn-circle avatar btn-ghost"
            >
              <FaUserCircle className="text-3xl" />
            </label>
            <ul
              tabIndex="0"
              className="menu dropdown-content shadow bg-base-100 rounded-lg w-52"
            >
              <li className="w-full">
                <button
                  className="w-full p-2 text-start"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

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
