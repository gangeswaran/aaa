const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../model/Student");
const generateOTP = require("../utils/otpGenerator");
const sendOtpEmail = require("../utils/emailService");

const router = express.Router();
const otpStore = new Map(); // Temporary OTP storage
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 🔹 **Verify User & Send OTP**
router.post("/verify-user", async (req, res) => {
  const { registernum, password } = req.body;

  try {
    const student = await Student.findOne({ registernum });
    if (!student) {
      return res.status(401).json({ success: false, message: "❌ Invalid Register Number!" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "❌ Incorrect Password!" });
    }

    // ✅ Generate OTP & Send Email
    const otp = generateOTP();
    otpStore.set(registernum, otp.toString()); // Store OTP as a **string**
    console.log(`OTP for ${registernum}:`, otp); // Debugging

    const sent = await sendOtpEmail(student.email, otp);
    if (sent) {
      res.json({ success: true, message: "✅ OTP sent to your email!" });
    } else {
      res.status(500).json({ success: false, message: "❌ Failed to send OTP!" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "❌ Server error!" });
  }
});

// 🔹 **Verify OTP & Log in**
router.post("/login", async (req, res) => {
  const { registernum, otp } = req.body;

  try {
    const storedOtp = otpStore.get(registernum);
    console.log(`Stored OTP for ${registernum}:`, storedOtp); // Debugging

    if (!storedOtp || storedOtp !== otp.toString()) {
      return res.status(401).json({ success: false, message: "❌ Invalid or expired OTP!" });
    }

    const student = await Student.findOne({ registernum });
    if (!student) {
      return res.status(404).json({ success: false, message: "❌ Student not found!" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: student._id, registernum: student.registernum, role: student.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Clear OTP after verification
    otpStore.delete(registernum);

    res.json({
      success: true,
      message: "✅ Login successful!",
      token,
      user: {
        name: student.name,
        registernum: student.registernum,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "❌ Server Error" });
  }
});

module.exports = router;
