import React, { useState } from "react";
import axios from "axios";

function StudentForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dob: "",
    department: "",
    year: "",
  });

  const [searchName, setSearchName] = useState("");
  const [student, setStudent] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to add student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/students", formData);
      alert(response.data.message);
      setFormData({ name: "", address: "", dob: "", department: "", year: "" });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Student Dashboard</h2>

      {/* Student Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 max-w-md mx-auto">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Add Student</button>
      </form>

    </div>
  );
}

export default StudentForm;
