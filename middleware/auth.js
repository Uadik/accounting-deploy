const jwt = require('jsonwebtoken');
const key = require('../config/keys_deploy').secretOrKey;

module.exports = function (req, res, next) {
  // get token from header
  const token = req.header('x-auth-token');

  // check if no token
  if (!token)
    return res.status(401).json({ msg: 'No token, authorization denied' });

  // verify token
  try {
    const decoded = jwt.verify(token, key);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
