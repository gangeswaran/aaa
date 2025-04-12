import { useState } from "react";
import { Menu, User, CalendarDays, Clock } from "lucide-react";
import StudentProfile from "./StudentProfile";
import Attendance from "./Attendance";


const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 mt-13">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col p-5 transition-all duration-300 shadow-lg`}
      >
        {/* Toggle Button */}
        <button
          className="self-end text-white p-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-all duration-300"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Dashboard Title */}
        {isSidebarOpen && (
          <h2 className="text-2xl font-semibold mb-6 mt-3">🎓 Dashboard</h2>
        )}

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-3">
          {[  
            { id: "profile", label: "Profile", Icon: User },
            { id: "attendance", label: "Attendance", Icon: Clock },
           
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-white shadow-md ${
                activeSection === id
                  ? "bg-blue-500 shadow-lg scale-105"
                  : "hover:bg-blue-600"
              }`}
              onClick={() => setActiveSection(id)}
            >
              <Icon className="w-5 h-5" />
              {isSidebarOpen && <span className="text-lg">{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="bg-white shadow-xl rounded-lg p-6 transition-all duration-300 animate-fadeIn">
          {activeSection === "profile" && <StudentProfile />}
          {activeSection === "attendance" && <Attendance />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;