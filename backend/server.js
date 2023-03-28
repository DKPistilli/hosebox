const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 8080;
const cors = require('cors');

connectDB();

const app = express();

// Parse JSON/URL encoded request body information
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable cross origin
app.use(cors());

// Routes
app.use('/api/users',          require('./routes/userRoutes'));
app.use('/api/inventoryCards', require('./routes/inventoryCardRoutes'));
app.use('/api/wishlistCards',  require('./routes/wishlistCardRoutes'));
app.use('/api/decks',          require('./routes/deckRoutes'));

// Error Handling
const {errorHandler} = require('./middleware/errorMiddleware');
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});