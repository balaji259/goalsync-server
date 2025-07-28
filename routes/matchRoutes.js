const express = require('express');
const router = express.Router();
const { getAutoMatches, getManualMatches } = require("../controllers/matchController");
const authMiddleware = require("../middleware/auth");

router.get('/auto', authMiddleware, getAutoMatches);
router.get('/manual', authMiddleware, getManualMatches);

module.exports = router;
