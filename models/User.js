const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Goal" }],

   profile: {
    bio: { type: String, trim: true, maxlength: 200 },
    avatar: { type: String }, 
    interests: [{ type: String, trim: true }],
    location: { type: String, trim: true }     
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
