const { Error } = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  Ok,
  Created,
} = require('../utils/errors');

// send({ data: cards })) --> cards
const getCards = (req, res, next) => {
  Card.find({})
    // .populate(['owner', 'likes'])
    .then((cards) => res.status(Ok).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        // .populate('owner')
        .orFail()
        .then((data) => res.status(Created).send(data))
        .catch((err) => {
          if (err instanceof Error.DocumentNotFoundError) {
            next(new NotFoundError('Карточка с таким id не найдена'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.status(Ok).send({ message: 'Карточка успешно удалена' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Чужую карточку удалить нельзя');
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с таким id не найдена'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  // добавить _id в массив, если его там нeт
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    // .populate(['owner'])
    .orFail()
    .then((card) => res.status(Ok).send(card))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с таким id не найдена'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  // убрать _id из delete
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    // .populate(['owner'])
    .orFail()
    .then((card) => res.status(Ok).send(card))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError(`Некорректные данные: ${err.message}`));
      } else if (err instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с таким id не найдена'));
      } else {
        next(err);
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
