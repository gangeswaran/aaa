import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clg from "../assets/clg.png";

function HomePage() {
  const navigate = useNavigate();
  const register = localStorage.getItem("registernum");

  const handleLogin = () => {
    if (register) {
      navigate("/student-profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-90"
        style={{ backgroundImage: `url(${clg})` }}
      ></div>

      {/* Header Section */}
      <div className="relative z-10 w-full text-center text-white px-6 py-10 bg-black bg-opacity-60 shadow-lg mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide">
          College of Engineering
        </h1>
        <p className="text-lg md:text-xl mt-3 font-medium">
          Empowering the Future with Innovation & Excellence
        </p>
      </div>

      {/* About Section */}
      <div className="relative z-10 mt-6 bg-white px-6 py-8 rounded-lg shadow-lg w-[90%] md:w-3/4 lg:w-2/3 text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-4">🏛 About Our College</h2>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
           College of Engineering, is a premier institution known for excellence in technical education, 
          research, and innovation. We provide a world-class learning environment that fosters intellectual and professional growth.
        </p>

        
      </div>

      {/* Login Button */}
      <div className="relative z-10 mt-6">
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg md:text-xl transition duration-300"
        >
          {"Go to Profile"}
        </button>
      </div>
    </div>
  );
}

export default HomePage;
