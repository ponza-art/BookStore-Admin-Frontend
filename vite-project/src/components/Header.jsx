import React from "react";
import { FaHome, FaBook, FaUsers, FaFirstOrder, FaUserCircle, FaHollyBerry  } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar bg-cyan-900 text-white px-4 py-3 flex flex-wrap justify-between items-center">
      <div className="flex items-center">
        <FaHome className="mr-2 text-xl" />
        <Link to="/" className="text-xl font-bold">Home</Link>
      </div>
      <div className="flex gap-5 flex-wrap justify-center md:gap-10">
        <Link to="/admin/books" className="flex items-center">
          <FaBook className="mr-1" /> <span className="hidden sm:inline">Manage Books</span>
        </Link>
        <Link to="/admin/users" className="flex items-center">
          <FaUsers className="mr-1" /> <span className="hidden sm:inline">Manage Users</span>
        </Link>
        <Link to="/admin/authors" className="flex items-center">
          <FaUserCircle className="mr-1" /> <span className="hidden sm:inline">Manage Authors</span>
        </Link>
        <Link to="/admin/categories" className="flex items-center">
          <FaHollyBerry  className="mr-1" /> <span className="hidden sm:inline">Manage Categories</span>
        </Link>
        <Link to="/admin/orders" className="flex items-center">
          <FaFirstOrder className="mr-1" /> <span className="hidden sm:inline">Manage Orders</span>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
