import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const studentToken = localStorage.getItem("token");
  const teacherToken = localStorage.getItem("teacherToken"); // Check for teacher token
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacherToken"); // Remove teacher token as well
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <h2 className="text-2xl font-bold tracking-wide cursor-pointer">
        <Link to="/">Attendance Management </Link>
      </h2>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6 text-lg">
        <Link to="/" className="hover:text-blue-400 transition duration-300">Home</Link>
        {/* Links based on Token Presence */}
        {studentToken ? (
          <>
            <Link to="/student-profile" className="hover:text-blue-400 transition duration-300">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : teacherToken ? (
          <>
            <Link to="/teacher-profile" className="hover:text-blue-400 transition duration-300">Teacher Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition duration-300">Login</Link>
            <Link to="/register" className="hover:text-blue-400 transition duration-300">Register</Link>
            <Link to="/teacher-login" className="hover:text-blue-400 transition duration-300">Teacher Login</Link>
            <Link to="/teacher-register" className="hover:text-blue-400 transition duration-300">Teacher Register</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-gray-900 flex flex-col items-center justify-center space-y-6 text-xl transition-transform duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Link to="/" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Home</Link>
        {studentToken ? (
          <>
            <Link to="/student-profile" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Profile</Link>
            <button onClick={handleLogout} className="bg-red-500 px-6 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </>
        ) : teacherToken ? (
          <>
            <Link to="/teacher-profile" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Teacher Profile</Link>
            <button onClick={handleLogout} className="bg-red-500 px-6 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Register</Link>
            <Link to="/teacher-login" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Teacher Login</Link>
            <Link to="/teacher-register" className="hover:text-blue-400" onClick={() => setMenuOpen(false)}>Teacher Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
