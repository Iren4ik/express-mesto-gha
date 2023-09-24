const { SECRET_KEY = 'some-secret-key' } = process.env;
const { Error } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const {
  Ok,
  Created,
} = require('../utils/errors');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(Created).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err instanceof Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true });
      res.status(Ok).send({ token });
    })
    .catch(next);
};

// send({ data: users })) --> users
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(Ok).send(users))
    .catch(next);
};

// send({ data: user })) --> user
const getUserbyId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(Ok).send(user))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else {
        next(err);
      }
    });
};

// send({ data: user })) --> user
const editProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(Ok).send(user))
    .catch((err) => {
      if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else if (err instanceof Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else {
        next(err);
      }
    });
};

// send({ data: user })) --> user
const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(Ok).send(user))
    .catch((err) => {
      if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else if (err instanceof Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else {
        next(err);
      }
    });
};

// data: user --> user
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((currentUser) => res.status(Ok).send(currentUser))
    .catch((err) => {
      if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else if (err instanceof Error.CastError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getCurrentUser,
  getUserbyId,
  editProfile,
  editAvatar,
};
