const Goal = require('../models/Goal');
const User = require('../models/User');
const Group = require('../models/Group');

const createGoal = async (req, res) => {
  try {
    const { title, type, creator, group, goalType, subGoals, deadline, description } = req.body;

    if (!title || !creator || !group) {
      return res.status(400).json({ message: "Title, creator, and group are required." });
    }

    // Check if creator exists
    const userExists = await User.findById(creator);
    if (!userExists) return res.status(404).json({ message: "Creator not found." });

    // Check if group exists and populate members
    const groupExists = await Group.findById(group).populate('members');
    if (!groupExists) return res.status(404).json({ message: "Group not found." });

    // Create the goal
    const newGoal = new Goal({
      title,
      type,
      creator,
      group,
      goalType: goalType || 'single',
      subGoals: goalType === 'checklist' && Array.isArray(subGoals) ? 
        subGoals.map(subGoal => ({
          text: subGoal.text || subGoal, // Handle both string and object formats
          completedBy: [] // Initialize empty array
        })) : [],
      deadline,
      description
    });

    // Initialize progress for all group members
    const initialProgress = groupExists.members.map(member => ({
      user: member._id,
      progressPercent: 0,
      completed: false,
      completedAt: null
    }));

    newGoal.progress = initialProgress;

    // Save the goal with initialized progress
    await newGoal.save();

    // Push goal to group
    groupExists.goals.push(newGoal._id);
    await groupExists.save();

    // Push goal to user
    userExists.goals.push(newGoal._id);
    await userExists.save();

    // Populate the saved goal before returning
    const populatedGoal = await Goal.findById(newGoal._id)
      .populate('creator', 'username email name')
      .populate('group', 'name type')
      .populate('progress.user', 'username email name');

    res.status(201).json(populatedGoal);
  } catch (e) {
    console.error("Error in createGoal:", e.message);
    res.status(500).json({ message: "Server error while creating goal." });
  }
};


const toggleLock = async(req,res) =>{
     try {
    const { goalId } = req.params;
    const userId = req.user.id; // From auth middleware
    
    const goal = await Goal.findById(goalId).populate('creator group');
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Only creator can lock/unlock goals
    if (goal.creator._id.toString() !== userId) {
      return res.status(403).json({ message: 'Only goal creator can lock/unlock goals' });
    }
    
    goal.isLocked = !goal.isLocked;
    await goal.save();
    
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const updateProgress = async(req,res) =>{
  try {
    const { goalId } = req.params;
    const { userId, progressPercent, completed, subGoalIndex } = req.body;
    const requesterId = req.user.id;
    
    const goal = await Goal.findById(goalId).populate('creator group progress.user');
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Check if goal is locked (only creator can edit locked goals)
    if (goal.isLocked && goal.creator._id.toString() !== requesterId) {
      return res.status(403).json({ message: 'This goal is locked and cannot be edited' });
    }
    
    // Handle subgoals (checklist type)
    if (goal.goalType === 'checklist' && subGoalIndex !== undefined) {
      if (completed) {
        if (!goal.subGoals[subGoalIndex].completedBy.includes(userId)) {
          goal.subGoals[subGoalIndex].completedBy.push(userId);
        }
      } else {
        goal.subGoals[subGoalIndex].completedBy = goal.subGoals[subGoalIndex].completedBy.filter(
          id => id.toString() !== userId
        );
      }
      
      // Calculate overall progress for this user
      const userCompletedSubGoals = goal.subGoals.filter(subGoal => 
        subGoal.completedBy.includes(userId)
      ).length;
      const overallProgress = goal.subGoals.length > 0 ? 
        (userCompletedSubGoals / goal.subGoals.length) * 100 : 0;
      
      // Update or create progress entry
      const existingProgressIndex = goal.progress.findIndex(
        p => p.user._id.toString() === userId
      );
      
      if (existingProgressIndex >= 0) {
        goal.progress[existingProgressIndex].progressPercent = overallProgress;
        goal.progress[existingProgressIndex].completed = overallProgress === 100;
        if (overallProgress === 100) {
          goal.progress[existingProgressIndex].completedAt = new Date();
        }
      } else {
        goal.progress.push({
          user: userId,
          progressPercent: overallProgress,
          completed: overallProgress === 100,
          completedAt: overallProgress === 100 ? new Date() : null
        });
      }
    } else {
      // Handle simple goals
      const existingProgressIndex = goal.progress.findIndex(
        p => p.user._id.toString() === userId
      );
      
      if (existingProgressIndex >= 0) {
        goal.progress[existingProgressIndex].progressPercent = progressPercent;
        goal.progress[existingProgressIndex].completed = completed;
        if (completed) {
          goal.progress[existingProgressIndex].completedAt = new Date();
        }
      } else {
        goal.progress.push({
          user: userId,
          progressPercent,
          completed,
          completedAt: completed ? new Date() : null
        });
      }
    }
    
    await goal.save();
    
    // Populate the updated goal before sending response
    const updatedGoal = await Goal.findById(goalId)
      .populate('creator group progress.user');
    
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



module.exports = {createGoal, toggleLock, updateProgress};
