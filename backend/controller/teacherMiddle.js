const jwt = require("jsonwebtoken");
const Teacher = require('../model/Teacher');
const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
  console.log("---Token:", token);

  if (!token) {
    console.log("---Invalid token");
    return res.status(401).json({ success: false, message: "Access Denied! No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    // req.user = decoded;
    req.teacher = await Teacher.findById(decoded.id).select("-password"); // Attach student to request
    console.log("---Teacher:", req.teacher);
    if (!req.teacher) {
      console.log("Invalid token");
      return res.status(404).json({ success: false, message: "Teacher not found!" });
    }
    next();
  } catch (err) {
    console.log("--Invalid token");
    res.status(401).json({ success: false, message: "Invalid Token!" });
  }
};

module.exports = verifyToken;
