import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const RegisterStudent = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [webcamOn, setWebcamOn] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
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
  });

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setWebcamOn(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setWebcamOn(true);
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const validateRegisterNum = async () => {
    if (!formData.registernum) return;
    try {
      const response = await axios.get(`/api/students/validate/${formData.registernum}`);
      if (response.data.valid) {
        setFormData((prevData) => ({
          ...prevData,
          ...response.data.student,
        }));
        setValid(true);
        setMessage("✅ Register Number is valid!");
      } else {
        setMessage("❌ Invalid Register Number!");
      }
    } catch (error) {
      setMessage("❌ Error validating Register Number");
    }
  };

  const registerFace = async () => {
    if (!capturedImage || !formData.name) {
      setMessage("❌ Capture image & enter name first!");
      return;
    }

    setLoading(true);

    const imageFile = dataURLtoFile(capturedImage, "register.jpg");
    const studentData = new FormData();
    studentData.append("image", imageFile);
    Object.entries(formData).forEach(([key, value]) => {
      studentData.append(key, value);
    });

    try {
      const response = await axios.post("/api/students/register", studentData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ " + response.data.message);
      window.location.href = "/login";
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.message || "Error registering face"));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-indigo-100 via-blue-100 to-cyan-100 py-10 px-6">
      <div className="w-full bg-white shadow-2xl rounded-xl p-10">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">📚 Student Registration Portal</h1>

        <div className="flex flex-col lg:flex-row gap-10 w-full">
          {/* Webcam Section */}
          <div className="flex flex-col items-center w-full lg:w-1/3">
            <div className="w-full aspect-square bg-gray-100 border border-gray-300 rounded-xl shadow-inner flex items-center justify-center">
              {webcamOn ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-xl w-full h-full object-cover"
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="rounded-xl w-full h-full object-cover"
                />
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2 w-full">
              {webcamOn ? (
                <button
                  onClick={capture}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  📷 Capture Photo
                </button>
              ) : (
                <button
                  onClick={retakePhoto}
                  className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                >
                  🔄 Retake Photo
                </button>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["Full Name", "name", "text"],
              ["Date of Birth", "dob", "date"],
              ["Address", "address", "text"],
              ["Age", "age", "number"],
              ["Department", "dept", "text"],
              ["Year", "year", "number"],
              ["Aadhar Number", "aadharnumber", "text"],
              ["Email", "email", "email"],
              ["Password", "password", "password"],
            ].map(([label, name, type]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            ))}

            {/* Register Number & Validate */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  name="registernum"
                  value={formData.registernum}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
                {/* <button
                  type="button"
                  onClick={validateRegisterNum}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition-all"
                >
                  ✅ Validate
                </button> */}
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={registerFace}
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-bold text-lg rounded-xl shadow hover:bg-green-700 transition-all"
              >
                {loading ? "Registering..." : " Register Student"}
              </button>
            </div>

            {message && (
              <div className="md:col-span-2 text-center text-md font-semibold text-red-600 mt-2">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;
