const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
// const auth = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.send('Все в порядке, можно работать!');
});

// router.use(auth); // все роуты ниже этой строки будут защищены

router.post('/signin', login);
router.post('/signup', createUser);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
