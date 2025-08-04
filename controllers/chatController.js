const ChatMessage = require("../models/ChatMessage");


const getGroupMessages = async (req,res) => {
    try{

    const { groupId } = req.params;

  const messages = await ChatMessage.find({ groupId })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('sender');

  res.json(messages.reverse());

    }catch(e){
        console.log(e.message);
    }
}

module.exports = {getGroupMessages};