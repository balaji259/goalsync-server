const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, groupController.createGroup);
router.get('/my-groups', authMiddleware, groupController.getUserGroups);
router.post('/join', authMiddleware, groupController.joinGroup);
router.get('/pending-requests', authMiddleware, groupController.getPendingRequests);
router.post('/handle-request', authMiddleware, groupController.handleJoinRequest);
router.get('/all', authMiddleware, groupController.getAllGroups);

module.exports = router;
