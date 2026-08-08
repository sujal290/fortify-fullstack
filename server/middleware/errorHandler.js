// PATH: server/middleware/errorHandler.js  (REPLACES existing file — proper 403 for CORS rejections)
// Central error handler — every controller uses express-async-handler,
// so thrown errors land here instead of crashing the process.
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (err.message === 'Not allowed by CORS') statusCode = 403;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };