const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

const secret = process.env.JWT_SECRET || 'dev_secret';
const expiresIn = '1h';

async function register(req, res) {
  try {
    const { nombreCompleto, email, password } = req.body;
    if (!nombreCompleto || !email || !password) {
      return res.status(400).json({ status: 'fail', data: { message: 'Missing fields' } });
    }
    const exists = await userService.findByEmail(email);
    if (exists) {
      return res.status(409).json({ status: 'fail', data: { message: 'Email already in use' } });
    }
    const user = await userService.createUser({ nombreCompleto, email, password });
    return res.status(201).json({ status: 'success', data: { id: user.id, nombreCompleto: user.nombreCompleto, email: user.email } });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    // Manejar errores comunes de Sequelize para dar respuestas más útiles
    if (err.name === 'SequelizeValidationError') {
      const details = err.errors ? err.errors.map((e) => e.message) : [err.message];
      return res.status(400).json({ status: 'fail', data: { errors: details } });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ status: 'fail', data: { message: 'Unique constraint violation' } });
    }

    const body = { status: 'error', message: 'Internal server error' };
    if (process.env.NODE_ENV !== 'production') {
      body.debug = err && err.message ? err.message : String(err);
    }
    return res.status(500).json(body);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', data: { message: 'Missing fields' } });
    }
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ status: 'fail', data: { message: 'Invalid credentials' } });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ status: 'fail', data: { message: 'Invalid credentials' } });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });
    return res.json({ status: 'success', data: { token } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

module.exports = { register, login };
