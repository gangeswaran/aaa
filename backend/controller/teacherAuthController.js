const Teacher = require('../model/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// You should move this to .env in production
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new teacher
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password, department, subjects } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      department,
      subjects
    });

    await newTeacher.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login teacher
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        subjects: teacher.subjects
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


// controllers/teacherController.js
// const Teacher = require('../models/Teacher');

// Add register numbers to assignedStudents
exports.addRegisterNumbers = async (req, res) => {
  try {
    const teacherId = req.teacher.id; // assuming JWT middleware sets this
    const { registerNumbers } = req.body; // expect an array of numbers

    if (!Array.isArray(registerNumbers)) {
      return res.status(400).json({ message: 'registerNumbers must be an array' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Merge arrays and remove duplicates
    const uniqueNumbers = Array.from(new Set([...teacher.assignedStudents, ...registerNumbers]));

    teacher.assignedStudents = uniqueNumbers;
    await teacher.save();

    res.json({
      message: 'Register numbers added successfully',
      assignedStudents: teacher.assignedStudents
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add register numbers', error: err.message });
  }
};


// controllers/teacherController.js
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id); // req.user.id from token
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ teacher });
  } catch (err) {
    console.error("Error fetching teacher profile:", err);
    res.status(500).json({ message: "Failed to fetch teacher data" });
  }
};

exports.addLocation = async (req, res) => {
  const teacherId = req.teacher.id;
  const { latitude, longitude, radius, startTime, endTime } = req.body;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Push a new allowed location to the array
    teacher.allowedLocations.push({
      latitude,
      longitude,
      radius,
      startTime,
      endTime
    });

    await teacher.save();
    res.status(200).json({ success: true, message: 'Allowed location added.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

const Student = require('../model/Student');
exports.getLocation = async (req, res) => {
  try {
    const studentId = req.student.id; // From token (middleware must decode JWT)
    
    // Optional: if register number is stored in user object
    const student = await Student.findById(studentId);
    const registerNumber = student.registernum;
    console.log(registerNumber);

    
    // Find a teacher who has this student assigned
    const teacher = await Teacher.findOne({
      assignedStudents: registerNumber,
    });

    if (!teacher) {
      return res.status(403).json({ message: 'You are not assigned by any teacher.' });
    }

    // Send location and time constraints (assume they're stored on the teacher model)
    return res.json({
      location: teacher.allowedLocations || 'Not set',
      timeConstraint: teacher.timeConstraint || 'Not set',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while fetching location.' });
  }
}