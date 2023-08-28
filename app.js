const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

// app.get('/', (req, res) => {
//   res.send('HI');
// })

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.listen(PORT);
