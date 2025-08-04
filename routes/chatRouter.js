const express = require('express');
const router = express.Router();
const { getGroupMessages } = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

router.get('/messages/:groupId', authMiddleware, getGroupMessages);


module.exports = router;
