const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["fitness", "health", "personal", "study", "habit", "other"], default: "personal" },
  isLocked: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  createdAt: { type: Date, default: Date.now },
  deadline: Date,
  status: { type: String, enum: ["active", "completed", "expired"], default: "active" },
  goalType: { type: String, enum: ["checklist", "single"], default: "single" }, 
  subGoals: [
    {
      text: String,
      completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] 
    }
  ],
  progress: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      progressPercent: Number,
      completed: { type: Boolean, default: false },
      completedAt: Date
    }
  ]
});

module.exports = mongoose.model("Goal", goalSchema);
