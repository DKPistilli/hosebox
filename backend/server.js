const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const port = process.env.port || 8000;

const app = express();

// Parse JSON/URL encoded request body information
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/goals', require('./routes/goalRoutes.js'));

// Error Handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});