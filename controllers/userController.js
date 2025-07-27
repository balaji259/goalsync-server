require('dotenv').config();

const User = require('../models/User'); 

const JWT_SECRET = process.env.JWT_SECRET;

// User Details Controller

const getProfileDetails = async (req, res) => {
  try {
        
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select('-password')
      .populate('goals'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  }catch(e){
    console.log(e.message);
        return res.status(500).json({message : "Internal server error"});
  }
}


//update Profile Controller

const updateProfile = async(req,res)=>{
    try{

        const userId = req.user.id;
        const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const { bio, avatar, interests, location } = req.body;

    if (!user.profile) user.profile = {};

    if (bio !== undefined) user.profile.bio = bio;
    if (avatar !== undefined) user.profile.avatar = avatar;
    if (location !== undefined) user.profile.location = location;

    if (interests !== undefined) {
      user.profile.interests = Array.isArray(interests)
        ? interests
        : interests.split(',').map((i) => i.trim().toLowerCase());
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: user.profile,
    });

    }catch(e){
        console.log(e.message);
        return res.status(500).json({message : "Internal server error"});
    }
}

module.exports = {getProfileDetails, updateProfile};