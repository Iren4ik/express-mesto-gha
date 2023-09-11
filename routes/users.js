const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../utils/constants');

const {
  getUsers,
  getCurrentUser,
  getUserbyId,
  editProfile,
  editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserbyId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), editProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex),
  }),
}), editAvatar);

module.exports = router;
