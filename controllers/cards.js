const Card = require('../models/card');

const {
  Ok,
  Created,
  BadRequest,
  NotFound,
  InternalServerError,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(Ok).send({ data: cards }))
    .catch(() => res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(Created).send(data))
        .catch(() => res.status(NotFound).send({ message: 'Карточка с таким id не найдена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(Ok).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  // добавить _id в массив, если его там нeт
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(Ok).send({ likes: card.likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  // убрать _id из массива
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(Ok).send({ likes: card.likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: `Некорректные данные: ${err.message}` });
      } else {
        res.status(InternalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
