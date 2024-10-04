import React, { useEffect, useState } from 'react';
import { FaHome, FaBook, FaUsers, FaUserCircle, FaFirstOrder, FaBars, FaBoxes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [theme, setTheme] = useState('light'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate(); 

  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); 
  }, [theme]);

  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  
  const handleLogout = () => {
    
    localStorage.removeItem('token');
    
    
    navigate('/');
  };

  return (
    <div className="navbar bg-base-200 shadow-lg p-4">
      {/* Sidebar toggle (Hamburger Icon) */}
      <div className="flex-none lg:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-square">
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Logo and Home link */}
      <div className="flex items-center flex-1">
        <FaHome className="mr-2 text-xl" />
        <Link to="/" className="text-xl font-bold">Home</Link>
      </div>

      {/* Navbar Links (visible on large screens only) */}
      <div className="hidden lg:flex flex-grow gap-6">
        <Link to="/admin/books" className="flex items-center">
          <FaBook className="mr-1" /> <span>Manage Books</span>
        </Link>
        <Link to="/admin/users" className="flex items-center">
          <FaUsers className="mr-1" /> <span>Manage Users</span>
        </Link>
        <Link to="/admin/authors" className="flex items-center">
          <FaUserCircle className="mr-1" /> <span>Manage Authors</span>
        </Link>
        <Link to="/admin/categories" className="flex items-center">
          <FaBoxes className="mr-1" /> <span>Manage Categories</span>
        </Link>
        {/* <Link to="/admin/orders" className="flex items-center">
          <FaFirstOrder className="mr-1" /> <span>Manage Orders</span>
        </Link> */}
      </div>

      {/* Profile and Theme Toggle */}
      <div className="flex items-center gap-4">
        <div className="dropdown dropdown-end">
          <label tabIndex="0" className="btn btn-square btn-ghost">
            <FaUserCircle className="text-2xl" />
          </label>
          <ul tabIndex="0" className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>

        {/* Light/Dark mode toggle */}
        <button onClick={toggleTheme} className="btn btn-square btn-ghost">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Mobile Menu (visible when menu is open) */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-base-100 shadow-lg lg:hidden">
          <div className="flex flex-col p-4 gap-4">
            <Link to="/admin/books" className="flex items-center">
              <FaBook className="mr-1" /> <span>Manage Books</span>
            </Link>
            <Link to="/admin/users" className="flex items-center">
              <FaUsers className="mr-1" /> <span>Manage Users</span>
            </Link>
            <Link to="/admin/authors" className="flex items-center">
              <FaUserCircle className="mr-1" /> <span>Manage Authors</span>
            </Link>
            <Link to="/admin/categories" className="flex items-center">
              <FaBoxes className="mr-1" /> <span>Manage Categories</span>
            </Link>
            {/* <Link to="/admin/orders" className="flex items-center">
              <FaFirstOrder className="mr-1" /> <span>Manage Orders</span>
            </Link> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
