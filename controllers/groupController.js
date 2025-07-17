const Group = require('../models/Group');
const JoinRequest = require('../models/JoinRequest');

const createGroup = async (req, res) => {
  const { name, type, joinCode, maxMembers } = req.body;
  const group = new Group({
    name,
    type,
    joinCode: type === 'private' ? joinCode : null,
    maxMembers,
    createdBy: req.user._id,
    members: [req.user._id],
  });

  await group.save();
  res.status(201).json(group);
};

const getUserGroups = async (req, res) => {
  const groups = await Group.find({ members: req.user._id });
  res.json(groups);
};

const joinGroup = async (req, res) => {
  const { groupId, joinCode } = req.body;
  const group = await Group.findById(groupId);

  if (!group) return res.status(404).json({ message: 'Group not found' });

  if (group.members.includes(req.user._id)) {
    return res.status(400).json({ message: 'Already a member' });
  }

  if (group.type === 'public') {
    group.members.push(req.user._id);
    await group.save();
    return res.json({ message: 'Joined group' });
  }

  if (group.type === 'private') {
    if (group.joinCode !== joinCode) {
      return res.status(400).json({ message: 'Invalid code' });
    }
    group.members.push(req.user._id);
    await group.save();
    return res.json({ message: 'Joined group' });
  }

  if (group.type === 'approval') {
    const existing = await JoinRequest.findOne({ group: groupId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already requested' });

    const request = new JoinRequest({ group: groupId, user: req.user._id });
    await request.save();
    return res.json({ message: 'Request sent' });
  }
};

const getPendingRequests = async (req, res) => {
  const requests = await JoinRequest.find({ status: 'pending' })
    .populate('user')
    .populate('group');

  // Filter only groups created by current user
  const userRequests = requests.filter(r => r.group.createdBy.equals(req.user._id));
  res.json(userRequests);
};

const handleJoinRequest = async (req, res) => {
  const { requestId, action } = req.body;

  const request = await JoinRequest.findById(requestId).populate('group');

  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (!request.group.createdBy.equals(req.user._id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  request.status = action;
  await request.save();

  if (action === 'approved') {
    const group = await Group.findById(request.group._id);
    group.members.push(request.user);
    await group.save();
  }

  res.json({ message: `Request ${action}` });
};

const getAllGroups = async (req, res) => {

  console.log("in controller");

  try {
    const groups = await Group.find()
      .populate('createdBy', 'username email') // Only include specific fields
      .populate('members', 'username email');   // Populate members too

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Failed to fetch groups', error });
  }
};


module.exports = {createGroup, getUserGroups, joinGroup, getPendingRequests, handleJoinRequest, getAllGroups}