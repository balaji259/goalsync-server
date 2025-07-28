const User = require('../models/User');

const getAutoMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const interestsArray = Array.isArray(currentUser.profile?.interests)
      ? currentUser.profile.interests
      : [];

    if (interestsArray.length === 0) {
      return res.status(200).json([]); // No interests, so return empty match list
    }

    const matches = await User.find({
      _id: { $ne: userId },
      'profile.interests': { $in: interestsArray }
    });

    res.status(200).json(matches);
  } catch (err) {
    console.error("Auto-matching error:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getManualMatches = async (req, res) => {
  try {
    const { interest } = req.query;
    const userId = req.user.id; 

    console.log("user id :");
    console.log(userId);

    if (!interest) {
      return res.status(400).json({ message: 'Interest required' });
    }

    const matches = await User.find({
      _id: { $ne: userId }, 
      'profile.interests': { $regex: new RegExp(interest, 'i') }
    }).select('-password -__v');

    res.status(200).json(matches);
  } catch (err) {
    console.error("Manual matching error:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};



module.exports = {getAutoMatches, getManualMatches};