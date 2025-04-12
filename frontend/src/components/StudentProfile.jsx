import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertTriangle, RefreshCcw } from "lucide-react";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/students/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(response.data.student);
    } catch (err) {
      setError("Failed to load student profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center text-red-600 text-center min-h-screen p-6">
        <AlertTriangle className="w-12 h-12 mb-3" />
        <p className="text-lg">{error}</p>
        <button
          onClick={fetchStudentInfo}
          className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition shadow-md"
        >
          <RefreshCcw className="w-5 h-5" /> Retry
        </button>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 backdrop-blur-md relative overflow-hidden">
        {/* Decorative Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10 blur-3xl" />

        <h2 className="text-4xl font-bold text-center text-blue-700 mb-6 relative z-10">
          🎓 Student Profile
        </h2>

        <div className="flex flex-col items-center relative z-10">
          {/* Avatar with Fallback */}
          <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-4xl font-bold rounded-full flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
            {student.imagePath ? (
              <img
                src={`${student.imagePath}`}
                alt="Student Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white">👤</span>
            )}
          </div>

          <h3 className="text-3xl font-semibold mt-4 text-gray-800">
            {student?.name || "N/A"}
          </h3>
          <p className="text-gray-600 text-lg">📧 {student?.email || "N/A"}</p>

          {/* Student Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full text-gray-700 text-lg">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🎂 DOB:</span>
              {student?.dob ? new Date(student.dob).toLocaleDateString("en-GB") : "N/A"}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">🏠 Address:</span>
              {student?.address || "N/A"}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">🎓 Department:</span>
              {student?.dept || "N/A"}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">📅 Year:</span>
              {student?.year || "N/A"}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold">🆔 Register No:</span>
              {student?.registernum || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;