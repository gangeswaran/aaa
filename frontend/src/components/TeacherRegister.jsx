import React, { useState } from 'react';
import axios from 'axios';

const TeacherRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    subjects: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const subjectArray = form.subjects.split(',').map(sub => sub.trim());
      const res = await axios.post('/api/teacher/register', {
        ...form,
        subjects: subjectArray
      });
      alert(res.data.message);
      window.location.href = "/teacher-login"
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-40 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Teacher Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <input type="text" name="department" placeholder="Department" onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input type="text" name="subjects" placeholder="Subjects (comma-separated)" onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default TeacherRegister;
