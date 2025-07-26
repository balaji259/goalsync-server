const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createGoal, toggleLock, updateProgress } = require('../controllers/goalController');


router.post('/create-goal', authMiddleware, createGoal);

router.patch('/:goalId/toggle-lock', authMiddleware, toggleLock);

router.patch('/:goalId/progress', authMiddleware, updateProgress);


module.exports = router;
