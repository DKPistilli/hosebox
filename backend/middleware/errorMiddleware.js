// Error Handler
// Only returns err.stack if in development
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);

    console.log(`Debugging in ${process.env.NODE_ENV} mode`);
    res.json({
        "message": err.message,
        "stack": process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = {
    errorHandler,
};