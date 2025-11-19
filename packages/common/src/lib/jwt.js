const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

function getSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment');
  }
  return process.env.JWT_SECRET;
}

function signPayload(payload, options = {}) {
  const secret = getSecret();
  const defaultOptions = { expiresIn: '1h' };
  return jwt.sign(payload, secret, { ...defaultOptions, ...options });
}

function verifyToken(token) {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret);
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
}

module.exports = {
  signPayload,
  verifyToken,
};


