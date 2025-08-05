const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const authRouter = require('./routes/authRouter');
const groupRouter = require('./routes/groupRouter');
const goalRouter = require('./routes/goalRouter');
const userRouter = require('./routes/userRouter');
const matchRouter =require('./routes/matchRoutes');
const ChatRouter = require('./routes/chatRouter');
const ChatMessage = require('./models/ChatMessage');
const connectDB = require('./db/db');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());



// Routes
app.use('/api/auth', authRouter);
app.use('/api/groups', groupRouter);
app.use('/api/goals', goalRouter);
app.use('/api/users', userRouter);
app.use('/api/match', matchRouter);
app.use('/api/chat',ChatRouter);

// Connect DB and start server...
connectDB();


io.on('connection', (socket) => {
  socket.on('joinRoom', (groupId) => {
    socket.join(groupId);
  });

  socket.on('sendMessage', async (msg) => {
    const newMsg = await ChatMessage.create({
      text: msg.text,
      groupId: msg.groupId,
      sender: msg.sender.id,
    });

    const populated = await ChatMessage.findById(newMsg._id).populate('sender');

    io.to(msg.groupId).emit('receiveMessage', populated);

  });
});



server.listen(8000,(req,res)=>{
    console.log(`server listening on port 8000`);
})