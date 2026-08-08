// PATH: server/middleware/validateObjectId.js  (NEW FILE)
const mongoose = require('mongoose');

// Rejects requests with a malformed :id-style param BEFORE it reaches
// Mongoose — without this, an invalid id (e.g. "undefined", or a crafted
// string) throws a raw CastError that either 500s or, worse, gets treated
// unpredictably by query operators. Use as: validateObjectId('id') or
// validateObjectId('productId') etc., matching the route's param name.
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    res.status(400);
    return next(new Error(`Invalid ${paramName}`));
  }
  next();
};

module.exports = validateObjectId;