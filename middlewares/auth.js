const { SECRET_KEY = 'some-secret-key' } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
// console.log(SECRET_KEY);

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  // убеждаемся, что токен есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  // извлечём токен и выкенем из заголовка приставку Bearer
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next();
};

module.exports = auth;
