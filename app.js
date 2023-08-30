const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { NotFound } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('Приветики');
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64eefb879942234182e4c71b', // Авторизованный пользователь
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NotFound).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
