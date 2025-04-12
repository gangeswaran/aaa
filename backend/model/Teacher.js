const mongoose = require('mongoose');

const allowedLocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  radius: { type: Number, default: 50 }, // optional radius check
  startTime: String, // e.g. "09:00"
  endTime: String    // e.g. "10:00"
}, { _id: false });

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password:{ type: String , require: true },
  department: String,
  subjects: [String],

  // List of student register numbers (numeric)
  assignedStudents: [Number],

  // Allowed geofence + time
  allowedLocations: [allowedLocationSchema]
});

module.exports = mongoose.model('Teacher', teacherSchema);
