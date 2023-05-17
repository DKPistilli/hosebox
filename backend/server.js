const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 8080;
const cors = require('cors');

connectDB();

const app = express();

// Middleware for parsing JSON request body
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: false }));

// Middleware for parsing raw text request body
app.use(express.text({ type: 'text/plain' }));

// Enable cross origin
app.use(cors());

// Routes
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));

// Error Handling
const {errorHandler} = require('./middleware/errorMiddleware');
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});