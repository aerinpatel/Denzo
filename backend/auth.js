const jwt = require('jsonwebtoken');


const JWT_SECRET = 'BADAM';

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


// module.exports = JWT_SECRET;
// module.exports = authorization;
module.exports= {JWT_SECRET,authorization};