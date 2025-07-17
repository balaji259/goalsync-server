const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRouter');
const connectDB = require('./db/db');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect DB and start server...
connectDB();

app.listen(8000,(req,res)=>{
    console.log(`server listening on port 8000`);
})