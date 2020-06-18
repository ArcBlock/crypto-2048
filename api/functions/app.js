/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const nocache = require('nocache');
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

const { decode } = require('../libs/jwt');
const { handlers, swapHandlers } = require('../libs/auth');

const netlifyPrefix = '/.netlify/functions/app';
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.BLOCKLET_APP_ID;
const isNetlify = process.env.NETLIFY && JSON.parse(process.env.NETLIFY);

if (!process.env.MONGO_URI) {
  throw new Error('Cannot start application without process.env.MONGO_URI');
}

// Connect to database
let isConnectedBefore = false;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, autoReconnect: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('disconnected', () => {
  console.log('Lost MongoDB connection...');
  if (!isConnectedBefore) {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, autoReconnect: true });
  }
});
mongoose.connection.on('connected', () => {
  isConnectedBefore = true;
  console.log('Connection established to MongoDB');
});
mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

// Create and config express application
const server = express();
server.use(compression());
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.use(
  morgan((tokens, req, res) => {
    const log = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');

    if (isProduction) {
      // Log only in AWS context to get back function logs
      console.log(log);
    }

    return log;
  })
);

server.use(bearerToken());
server.use((req, res, next) => {
  if (!req.token) {
    next();
    return;
  }

  decode(req.token)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => {
      next();
    });
});

const router = express.Router();

handlers.attach(Object.assign({ app: router }, require('../routes/auth/login')));
handlers.attach(Object.assign({ app: router }, require('../routes/auth/authorize')));
handlers.attach(Object.assign({ app: router }, require('../routes/auth/trophy')));
swapHandlers.attach(Object.assign({ app: router }, require('../routes/auth/swap')));
require('../routes/session').init(router);
require('../routes/game').init(router);

if (isProduction) {
  server.use(compression());
  if (isNetlify) {
    server.use(netlifyPrefix, router);
  } else {
    server.use(router);
  }

  const staticDir = process.env.BLOCKLET_APP_ID ? './' : '../../';
  server.use(express.static(path.resolve(__dirname, staticDir, 'build'), { maxAge: '365d', index: false }));
  server.get('*', nocache(), (req, res) => {
    res.send(fs.readFileSync(path.resolve(__dirname, staticDir, 'build/index.html')).toString());
  });

  server.use((req, res) => {
    res.status(404).send('404 NOT FOUND');
  });

  // eslint-disable-next-line no-unused-vars
  server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
} else {
  server.use(router);
}

// Make it serverless
exports.handler = serverless(server);
exports.server = server;
