const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const Student = require("./model/Student");
const path = require("path");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const auth = require("./routes/auth");

const { cloudinary } = require("./config/cloudinary"); // Cloudinary config

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

// Load face-api.js models
const MODELS_PATH = path.join(__dirname, "./models");

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODELS_PATH);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
}

loadModels().then(() => console.log("Face API models loaded successfully!"));

// Setup multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Face recognition route
app.post("/recognize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image file is required" });

    const img = await canvas.loadImage(req.file.buffer);
    const input = faceapi.createCanvasFromMedia(img);

    const detection = await faceapi
      .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return res.status(400).json({ error: "No face detected" });

    const students = await Student.find({}, { name: 1, registernum: 1, descriptor: 1, imageUrl: 1 });

    let recognizedUser = null;
    let minDistance = 0.6;

    for (const student of students) {
      if (!student.descriptor) continue;
      const storedDescriptor = new Float32Array(student.descriptor);
      const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);
      if (distance < minDistance) {
        recognizedUser = student;
        minDistance = distance;
      }
    }

    if (recognizedUser) {
      return res.json({
        message: "✅ Face recognized!",
        user: {
          registernum: recognizedUser.registernum,
          name: recognizedUser.name,
          imageUrl: recognizedUser.imageUrl,
        },
      });
    } else {
      return res.status(400).json({ error: "❌ Face not recognized in this account" });
    }
  } catch (error) {
    console.error("Face Recognition Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API routes
const teacherAuthRoutes = require('./routes/teacherAuthRoutes');
app.use('/api/teacher', teacherAuthRoutes);
app.use("/api/auth", auth);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
