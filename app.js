const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64ee0eb1f69f7361ed7982fc', // Тестовый пользователь 3
  };
  next();
});

app.use('/', require('./routes/index'));

app.use(errorHandler);

app.listen(PORT);
