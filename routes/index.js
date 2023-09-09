const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { NotFound } = require('../utils/errors');
// const { createUser, login } = require('../controllers/users');
// const auth = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.send('Все в порядке, можно работать!');
});

// router.post('/signin', login);
// router.post('/signup', createUser);

// router.use(auth); // все роуты ниже этой строки будут защищены

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res) => {
  res.status(NotFound).send({ message: 'Страница не найдена' });
});

module.exports = router;
