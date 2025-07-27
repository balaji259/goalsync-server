const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {getProfileDetails, updateProfile} = require("../controllers/userController");

// Get User Details Route
router.get('/getprofile', authMiddleware, getProfileDetails);

//update profile
router.put('/update-profile', authMiddleware, updateProfile);


module.exports = router;
