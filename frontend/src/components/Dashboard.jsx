import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    axios.get('/api/attendance')
      .then(response => setAttendance(response.data))
      .catch(error => console.error('Error fetching attendance:', error));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Campus Connect - Attendance Dashboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Latitude</th>
            <th className="border border-gray-300 px-4 py-2">Longitude</th>
            <th className="border border-gray-300 px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{record.latitude}</td>
              <td className="border border-gray-300 px-4 py-2">{record.longitude}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(record.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/att">Attendance</a>
    </div>
  );
}

export default Dashboard;