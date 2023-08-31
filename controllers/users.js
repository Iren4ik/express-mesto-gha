const User = require('../models/user');

const {
  Ok,
  Created,
  BadRequest,
  NotFound,
  InternalServerError,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(Ok).send({ data: users }))
    .catch(() => res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' }));
};

const getUserbyId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(Ok).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NotFound).send({ message: 'Пользователь с таким id не найден' });
      } else if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(Created).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const editProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(Ok).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NotFound).send({ message: 'Пользователь с таким id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(Ok).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(NotFound).send({ message: 'Пользователь с таким id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUserbyId,
  createUser,
  editProfile,
  editAvatar,
};
