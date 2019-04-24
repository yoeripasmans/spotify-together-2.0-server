require('dotenv').config({
  path: `.env.${process.env.APP_ENV}`
});

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const compress = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');
const port = process.env.PORT || 3001;

mongoose.connect(process.env.dbURI, { useNewUrlParser: true });
console.log(process.env.CORS_URL);
app.use(cors({credentials: true, origin: process.env.CORS_URL }));

io.set('transports', ['websocket']);

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

app.use('/', routes(io));

server.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
