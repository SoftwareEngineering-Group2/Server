const { auth } = require('firebase-admin');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send({ error: 'Authentication token is required.' });
  }

  try {
    const decodedToken = await auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send({ error: 'Invalid or expired token.' });
  }
};

module.exports = { authenticate };
