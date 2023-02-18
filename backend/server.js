const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.port || 8000;

connectDB();

const app = express();

// Parse JSON/URL encoded request body information
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error Handling
const {errorHandler} = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Routes
app.use('/api/goals', require('./routes/goalRoutes.js'));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});