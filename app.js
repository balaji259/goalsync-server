const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');
const groupRouter = require('./routes/groupRouter');
const connectDB = require('./db/db');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/groups', groupRouter);


// Connect DB and start server...
connectDB();

app.listen(8000,(req,res)=>{
    console.log(`server listening on port 8000`);
})