const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createGoal } = require('../controllers/goalController');


router.post('/create-goal', authMiddleware, createGoal);


module.exports = router;
