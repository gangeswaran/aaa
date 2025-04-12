import React, { useState } from 'react';
import axios from 'axios';

const TeacherLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/teacher/login', form);
      alert(res.data.message);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/teacher-dashboard';
      // optionally: navigate to dashboard
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Teacher Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Login</button>
      </form>
    </div>
  );
};

export default TeacherLogin;
