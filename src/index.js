require('dotenv').config({
  path: `.env.${process.env.APP_ENV}`
});

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('./sockets').listen(server);
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const compress = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const routes = require('./routes');
const port = process.env.PORT || 3001;

mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useFindAndModify: false });
app.use(cors({credentials: true, origin: process.env.CORS_URL }));

app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('keyboard cat'));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: 'session',
      })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes());

server.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
