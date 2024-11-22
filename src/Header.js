import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

function Header() {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    navigate('/');
  };

  const handleImage = () => {
    navigate('/file-upload');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md py-4 z-50">
      <div className="container flex flex-wrap items-center justify-between px-4">
        {/* Logo on the left */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto " />
        </div>
        {/* Navigation Links */}
        <nav className="absolute top-6 right-4 space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-800 font-medium"
            onClick={handleLogout}
          >
            Text Editor
          </Link>
          <Link
            to="/file-upload"
            className="text-gray-700 hover:text-blue-800 font-medium"
            onClick={handleImage}
          >
            Image Uploader
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
