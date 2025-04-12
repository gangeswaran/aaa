import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [registerInput, setRegisterInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState({
    latitude: '',
    longitude: '',
    radius: 50,
    startTime: '',
    endTime: ''
  });

  const token = localStorage.getItem('token');

  const fetchTeacherData = async () => {
    try {
      const res = await axios.get('/api/teacher/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeacher(res.data.teacher);
    } catch (err) {
      console.error(err);
      alert('Failed to load teacher info.');
    }
  };

  const handleAddRegisters = async (e) => {
    e.preventDefault();
    setLoading(true);
    const numbers = registerInput
      .split(',')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    try {
      const res = await axios.post(
        '/api/teacher/add-register-numbers',
        { registerNumbers: numbers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Register numbers added!');
      setTeacher(prev => ({
        ...prev,
        assignedStudents: res.data.assignedStudents
      }));
      setRegisterInput('');
    } catch (err) {
      alert('Failed to add register numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    const { latitude, longitude, radius, startTime, endTime } = locationInput;

    try {
      const res = await axios.post(
        '/api/teacher/add-location',
        { latitude, longitude, radius, startTime, endTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Allowed location added!');
      fetchTeacherData();
      setLocationInput({
        latitude: '',
        longitude: '',
        radius: 50,
        startTime: '',
        endTime: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add allowed location');
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  if (!teacher) return <div className="text-center mt-10">Loading dashboard...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Welcome, {teacher.name}</h1>
      <p className="text-gray-700 mb-2">Department: <strong>{teacher.department}</strong></p>
      <p className="text-gray-700 mb-4">
        Subjects: {teacher.subjects.join(', ')}
      </p>

      {/* Register Number Form */}
      <form onSubmit={handleAddRegisters} className="mb-8">
        <label className="block mb-2 font-medium">Add Register Numbers (comma-separated)</label>
        <input
          type="text"
          value={registerInput}
          onChange={(e) => setRegisterInput(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          placeholder="e.g. 1001, 1002, 1003"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Register Numbers'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Assigned Students</h2>
      {teacher.assignedStudents.length === 0 ? (
        <p className="text-gray-500 mb-6">No students assigned yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 mb-6">
          {teacher.assignedStudents.map((num, idx) => (
            <li key={idx} className="bg-gray-100 p-2 rounded">{num}</li>
          ))}
        </ul>
      )}

      {/* Location Form */}
      <h2 className="text-xl font-semibold mb-2">Add Allowed Location + Time</h2>
      <form onSubmit={handleAddLocation} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          className="p-2 border rounded"
          value={locationInput.latitude}
          onChange={(e) => setLocationInput({ ...locationInput, latitude: e.target.value })}
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          className="p-2 border rounded"
          value={locationInput.longitude}
          onChange={(e) => setLocationInput({ ...locationInput, longitude: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Radius (meters)"
          className="p-2 border rounded"
          value={locationInput.radius}
          onChange={(e) => setLocationInput({ ...locationInput, radius: e.target.value })}
        />
        <input
          type="time"
          placeholder="Start Time"
          className="p-2 border rounded"
          value={locationInput.startTime}
          onChange={(e) => setLocationInput({ ...locationInput, startTime: e.target.value })}
          required
        />
        <input
          type="time"
          placeholder="End Time"
          className="p-2 border rounded"
          value={locationInput.endTime}
          onChange={(e) => setLocationInput({ ...locationInput, endTime: e.target.value })}
          required
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Allowed Location
        </button>
      </form>

      {/* Display Locations */}
      <h2 className="text-xl font-semibold mb-2">Allowed Locations</h2>
      {teacher.allowedLocations?.length === 0 ? (
        <p className="text-gray-500">No allowed locations added yet.</p>
      ) : (
        <ul className="space-y-2">
          {teacher.allowedLocations.map((loc, idx) => (
            <li key={idx} className="bg-gray-100 p-3 rounded text-sm">
              📍 Lat: {loc.latitude}, Lon: {loc.longitude} | 🎯 Radius: {loc.radius}m <br />
              ⏰ From {loc.startTime} to {loc.endTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeacherDashboard;
