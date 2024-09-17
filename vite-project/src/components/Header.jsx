
import React from "react";
import { FaHome, FaBook, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar bg-cyan-900 text-white px-4 py-3">
      <div className="flex items-center">
        <FaHome className="mr-2 text-xl" />
        <Link to="/" className="text-xl font-bold">Home</Link>
      </div>
      <div className="flex mx-auto gap-10">
        <Link to="/admin/books" className="flex items-center">
          <FaBook className="mr-1" /> Manage Books
        </Link>
        <Link to="/admin/users" className="flex items-center">
          <FaUsers className="mr-1" /> Manage Users
        </Link>
      </div>
    </nav>
  );
};

export default Header;
