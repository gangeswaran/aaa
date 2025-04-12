// import React, { useRef, useState } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";

// const RegisterStudent = () => {
//   const webcamRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     dob: "",
//     address: "",
//     age: "",
//     dept: "",
//     year: "",
//     aadharnumber: "",
//     registernum: "",
//     email: "",
//     password: "",
//   });

//   // Capture image from webcam
//   const capture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//   };

//   // Convert Base64 image to File
//   const dataURLtoFile = (dataurl, filename) => {
//     let arr = dataurl.split(",");
//     let mime = arr[0].match(/:(.*?);/)[1];
//     let bstr = atob(arr[1]);
//     let n = bstr.length;
//     let u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, { type: mime });
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Register student with face
//   const registerFace = async () => {
//     if (!capturedImage || !formData.name) {
//       setMessage("❌ Capture image & enter name first!");
//       return;
//     }

//     setLoading(true);

//     const imageFile = dataURLtoFile(capturedImage, "register.jpg");
//     const studentData = new FormData();
//     studentData.append("image", imageFile);

//     Object.entries(formData).forEach(([key, value]) => {
//       studentData.append(key, value);
//     });

//     // Debugging: Check if all fields are appended properly
//     console.log("Final FormData:");
//     for (let pair of studentData.entries()) {
//       console.log(pair[0] + ": ", pair[1]);
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/students/register", studentData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("✅ " + response.data.message);
//     } catch (error) {
//       setMessage("❌ " + (error.response?.data?.message || "Error registering face"));
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Registration</h1>
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
//         <div className="flex flex-col items-center">
//           <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg shadow-md" />
//           <button onClick={capture} className="mt-3 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
//             Capture Photo
//           </button>
//           {capturedImage && <img src={capturedImage} alt="Captured" className="mt-3 w-32 h-32 rounded-lg shadow-md border border-gray-300" />}
//         </div>

//         <form className="mt-6 space-y-4">
//           <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="input-field" />
//           <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field" />
//           <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="input-field" />
//           <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="input-field" />
//           <input type="text" name="dept" placeholder="Department" value={formData.dept} onChange={handleChange} className="input-field" />
//           <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="input-field" />
//           <input type="text" name="aadharnumber" placeholder="Aadhar Number" value={formData.aadharnumber} onChange={handleChange} className="input-field" />
//           <input type="text" name="registernum" placeholder="Register Number" value={formData.registernum} onChange={handleChange} className="input-field" />
//           <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-field" />
//           <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-field" />

//           <button type="button" onClick={registerFace} className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         {message && <p className="mt-4 text-center font-semibold text-red-600">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default RegisterStudent;

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

  // Capture image from webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setWebcamOn(false);
  };
  const retakePhoto = () => {
    setCapturedImage(null);
    setWebcamOn(true); // Turn webcam back on for a retake
  };

  // Convert Base64 image to File
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

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Validate Register Number
  const validateRegisterNum = async () => {
    if (!formData.registernum) return;

    try {
      const response = await axios.get(
        `/api/students/validate/${formData.registernum}`
      );
      if (response.data.valid) {
        setFormData((prevData) => ({
          ...prevData,
          ...response.data.student, // Assuming API returns student details
        }));
        setValid(response.data.valid);
        setMessage("✅ Register Number is valid!");
      } else {
        setMessage("❌ Invalid Register Number!");
      }
    } catch (error) {
      setMessage("❌ Error validating Register Number");
    }
  };

  // Register student with face
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
      const response = await axios.post(
        "/api/students/register",
        studentData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ " + response.data.message);
      window.location.href = '/login'
    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.message || "Error registering face")
      );
    }

    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 mt-10">
      <h1 className="text-4xl font-extrabold text-black mb-8 drop-shadow-lg">
        Student Registration
      </h1>

      <div className="bg-white/30 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-4xl border border-white/20">
     
          <div className="grid grid-cols-2 gap-8 items-start mt-6">
            {/* Left Side - Webcam */}
           
            <div className="flex flex-col items-center">
              {webcamOn ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full max-w-xs rounded-lg shadow-lg border border-gray-300"
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="mt-3 w-32 h-32 rounded-lg shadow-lg border border-gray-300"
                />
              )}

              {webcamOn ? (
                <button
                  onClick={capture}
                  className="mt-3 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
                >
                  Capture Photo
                </button>
              ) : (
                <button
                  onClick={retakePhoto}
                  className="mt-3 px-5 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-transform duration-300 hover:scale-105"
                >
                  Retake Photo
                </button>
              )}
            </div>

            {/* Right Side - Form */}
            <form className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="dept"
                placeholder="Department"
                value={formData.dept}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={formData.year}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="text"
                name="aadharnumber"
                placeholder="Aadhar Number"
                value={formData.aadharnumber}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
              />

              <button
                type="button"
                onClick={registerFace}
                className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-transform duration-300 hover:scale-105"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        {message && (
          <p className="mt-4 text-center font-semibold text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterStudent;
