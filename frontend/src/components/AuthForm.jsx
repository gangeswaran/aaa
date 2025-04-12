import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    age: "",
    dept: "",
    year: "",
    aadharnumber: "",
    registernum: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/students/login" : "/api/students/register";

    // Create payload
    const payload = isLogin
      ? { registernum: formData.registernum, password: formData.password }
      : { ...formData };

    try {
      const { data } = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.token) {
        localStorage.setItem("token", data.token); // Store JWT token
        navigate("/student-profile"); // Navigate to attendance page
      }
      console.log(data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-600">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Register Fields (only show if registering) */}
          {!isLogin && (
            <>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full p-2 mt-1 border rounded-md"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label className="block font-semibold mt-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="w-full p-2 mt-1 border rounded-md"
                value={formData.dob}
                onChange={handleChange}
                required
              />

              <label className="block font-semibold mt-2">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                className="w-full p-2 mt-1 border rounded-md"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <label className="block font-semibold mt-2">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                className="w-full p-2 mt-1 border rounded-md"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <label className="block font-semibold mt-2">Department</label>
              <input
                type="text"
                name="dept"
                placeholder="Enter your department"
                className="w-full p-2 mt-1 border rounded-md"
                value={formData.dept}
                onChange={handleChange}
                required
              />

              <label className="block font-semibold mt-2">Year</label>
              <input
                type="text"
                name="year"
                placeholder="Enter your year"
                className="w-full p-2 mt-1 border rounded-md"
                value={formData.year}
                onChange={handleChange}
                required
              />

              <label className="block font-semibold mt-2">Aadhar Number</label>
              <input
                type="text"
                name="aadharnumber"
                placeholder="Enter your Aadhar number"
                className="w-full p-2 mt-1 border rounded-md"
                value={formData.aadharnumber}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* Register Number (Used for Login & Registration) */}
          <label className="block font-semibold mt-2">Register Number</label>
          <input
            type="text"
            name="registernum"
            placeholder="Enter your Register Number"
            className="w-full p-2 mt-1 border rounded-md"
            value={formData.registernum}
            onChange={handleChange}
            required
          />
          {/* email input */}
          <label className="block font-semibold mt-2">Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-2 mt-1 border rounded-md"
            value={formData.email}
            onChange={handleChange}
            required
            />
            

          {/* Password Input */}
          <label className="block mt-4 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full p-2 mt-1 border rounded-md"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Role Selection (only for registration) */}
          {!isLogin && (
            <>
              <label className="block mt-4 font-semibold">Login as:</label>
              <select
                name="role"
                className="w-full p-2 border rounded-md"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 mt-6 rounded-md hover:bg-blue-700"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
