const Goal = require('../models/Goal');


const createGoal = async (req,res)=>{
    try{
        const newGoal = new Goal(req.body);
        await newGoal.save();
       res.status(201).json(newGoal);
    }catch(e){
        console.log(e.message);
    }
}



module.exports = {createGoal};
