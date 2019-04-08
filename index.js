require('dotenv').config();
require('./config/passport.js');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const compress = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');
const port = process.env.SERVER_PORT || 3001;

mongoose.connect(process.env.dbURI, { useNewUrlParser: true });

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

app.use(cookieParser('keyboard cat'));
app.use(methodOverride());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
	cookie : {
		expires: false,
	},
  store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: 'session',
      })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

io.on('connection', (socket) => {
});

server.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
