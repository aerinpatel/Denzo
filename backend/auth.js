const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET; // Access the JWT_SECRET from process.env

function authorization(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(469).send('Unauthorized');
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(469).send('Unauthorized');
  }
}

module.exports = { JWT_SECRET, authorization };