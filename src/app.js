require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init dbs
require('./configs/init.mongodb');

// init routers
app.use('/', require('./routers/index'));

// handle errors

module.exports = app;
