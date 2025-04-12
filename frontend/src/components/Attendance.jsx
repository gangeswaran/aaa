import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { FiCamera, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Attendance = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState("⏳ Fetching location...");
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [markedAttendance, setMarkedAttendance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [webcamOn, setWebcamOn] = useState(true);
  const [attendance, setAttendance] = useState(false);
  const webcamRef = useRef(null);
  const [collegeCenter, setCollegeCenter] = useState({ lat: 0, lng: 0 });
  const radius = 100;

  const token = localStorage.getItem("token");
  const registerNum = localStorage.getItem("registernum");

  useEffect(() => {
    const fetchLocationSettings = async () => {
      try {
        const res = await axios.get("/api/teacher/location-settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const location = res.data.location[0]
        console.log(location);
        setCollegeCenter({ lat: location.latitude, lng: location.longitude })
                // setRadius(res.data.radius);
      } catch (error) {
        console.error("Error fetching location settings:", error);
      }
    };
  
    if (token) {
      fetchLocationSettings();
    }
  }, [token]);
  
  useEffect(() => {
    if (!token) {
      setStatus("❌ User not authenticated. Please log in.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setStatus("✅ Location acquired.");
      },
      (error) => {
        console.error("Error getting location:", error);
        setStatus("❌ Location access denied. Enable location services.");
      }
    );
  }, [token]);

  const toRad = (value) => (value * Math.PI) / 180;

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setWebcamOn(false);
      setStatus("✅ Photo captured. Now verify your face.");
    } else {
      setStatus("❌ Failed to capture image. Try again.");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setWebcamOn(true);
    setFaceVerified(false);
    setLocationVerified(false);
    setMarkedAttendance(false);
    setStatus("📸 Retake your photo.");
  };

  const verifyFace = async () => {
    if (!token) {
      setStatus("❌ User authentication failed. Please log in.");
      return;
    }

    setLoading(true);
    setStatus("⏳ Verifying face...");

    try {
      const imageFile = new File(
        [await (await fetch(capturedImage)).blob()],
        "recognize.jpg",
        { type: "image/jpeg" }
      );

      const formData = new FormData();
      formData.append("image", imageFile);

      const faceResponse = await axios.post(
        "/recognize",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!faceResponse.data.message || !faceResponse.data.user?.registernum) {
        setStatus("❌ Face recognition failed.");
        setLoading(false);
        return;
      }

      if (Number(registerNum) !== Number(faceResponse.data.user.registernum)) {
        setStatus("❌ Face does not match this account.");
        setLoading(false);
        return;
      }

      setStatus("✅ Face verified. Now verify your location.");
      setFaceVerified(true);
    } catch (error) {
      console.error("Error:", error.response?.data?.error);
      setStatus("❌ Error in face verification.");
      setMessage(error?.response?.data?.error || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const verifyLocation = () => {
    if (!latitude || !longitude) {
      setStatus("❌ Location not available.");
      return;
    }

    const distance = calculateDistance(
      latitude,
      longitude,
      collegeCenter.lat,
      collegeCenter.lng
    );

    if (distance > radius) {
      setStatus(
        `❌ You are outside the allowed area. (${distance.toFixed(2)}m away) \n Do you want to mark absent.`
      );
      markAbsent();
      return;
    }

    setStatus("✅ Location verified. Now mark attendance.");
    setLocationVerified(true);
  };
  const markAbsent = async() => {
    const distance = calculateDistance(
      latitude,
      longitude,
      collegeCenter.lat,
      collegeCenter.lng
    );
    try {
      const response = await axios.post(
        "/api/attendance/mark-attendance",
        { latitude, longitude,status:"Absent",distance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendance(response.data.message);
      console.log(response.data);
      if (response.data.success) {
        setStatus(response.data.message);
        setMarkedAttendance(true);
      } else {
        setStatus(response.data.message);
      }
    } catch (error) {
      console.error("Error:--", error);
      setStatus("❌ Error in attendance process.");
      setMessage(error?.response?.data?.error || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }
  const markAttendance = async () => {
    setLoading(true);
    setStatus("⏳ Marking attendance...");
    const distance = calculateDistance(
      latitude,
      longitude,
      COLLEGE_CENTER.lat,
      COLLEGE_CENTER.lng
    );
    try {
      const response = await axios.post(
        "/api/attendance/mark-attendance",
        { latitude, longitude,status:"Present",distance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendance(response.data.message);
      console.log(response.data);
      
      if (response.data.success) {
        setStatus("✅ Attendance marked successfully.");
        setMarkedAttendance(true);
      } else {
        setStatus("❌ Attendance marking failed."); 
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.error);
      setStatus("❌ Error in attendance process.");
      setMessage(error?.response?.data?.error || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto text-center border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        📍 Face & Location Attendance
      </h3>

      <div className="flex flex-col items-center">
        {webcamOn ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full max-w-xs rounded-lg shadow-md border border-gray-300"
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="mt-3 w-32 h-32 rounded-lg shadow-md border border-gray-300"
          />
        )}
        {!attendance && (
          <button
            onClick={webcamOn ? capture : retakePhoto}
            className="mt-3 px-5 py-2 flex items-center gap-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
          >
            {webcamOn ? <FiCamera /> : <FiRefreshCw />}
            {webcamOn ? "Capture Photo" : "Retake Photo"}
          </button>
        )}
      </div>

      {capturedImage && !faceVerified && (
        <button
          onClick={verifyFace}
          className="mt-3 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 active:scale-95 animate-fadeIn"
        >
          Verify Face
        </button>
      )}

      {faceVerified && !locationVerified && !markedAttendance && (
        <button
          onClick={verifyLocation}
          className="mt-3 px-6 py-2 rounded-lg bg-green-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-green-600 focus:ring-4 focus:ring-green-300 active:scale-95 animate-fadeIn"
        >
          Verify Location
        </button>
      )}

      {faceVerified && locationVerified && !markedAttendance && (
        <button
          onClick={markAttendance}
          className="mt-3 px-6 py-2 rounded-lg bg-purple-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 active:scale-95 animate-pulse"
        >
          Mark Attendance
        </button>
      )}

      <p className="mt-2 text-sm text-gray-600 animate-fadeIn">{status}</p>
    </div>
  );
};

export default Attendance;
