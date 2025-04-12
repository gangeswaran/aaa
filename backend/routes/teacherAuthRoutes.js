const express = require('express');
const router = express.Router();
const { registerTeacher, loginTeacher, addRegisterNumbers, getTeacherProfile, addLocation, getLocation } = require('../controller/teacherAuthController');
const verifyToken = require('../controller/teacherMiddle');
const authMiddleware = require('../controller/middelware');

router.post('/register', registerTeacher);
router.post('/login', loginTeacher);
router.post('/add-register-numbers',verifyToken,addRegisterNumbers)
router.get('/me',verifyToken, getTeacherProfile)
router.post('/add-location', verifyToken, addLocation);
router.get('/location-settings', authMiddleware,getLocation)
module.exports = router;
