const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { codeRouter } = require('./routes/code');
const { themesRouter } = require('./routes/themes');
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Adjust origin

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/code', codeRouter);
app.use('/api/v1/themes', themesRouter);

app.listen(3300);
