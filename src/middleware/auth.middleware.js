const jwt = require('jsonwebtoken');
const { findUserById } = require('../services/user.service');

const secret = process.env.JWT_SECRET || 'dev_secret';

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', data: { message: 'Authorization token missing' } });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, secret);
    const user = await findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ status: 'fail', data: { message: 'Invalid token (user not found)' } });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', data: { message: 'Invalid or expired token' } });
  }
}

module.exports = authMiddleware;
