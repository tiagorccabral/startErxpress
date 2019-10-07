import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import httpStatus from 'http-status';
import passport from 'passport';
import APIError from '../helpers/APIError';
import routes from '../config/routes/index';
import passConfig from './passportConfig';

// Initialize express app
const app = express();

// create server
const server = require('http').createServer(app);

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
// configure passport for authentication
passConfig(passport);
app.use(passport.initialize());

// All API routes start with /api
app.use('/api', routes);

/**
 * catch 404 and forward to error handler
 */
app.use((req, res, next) => next(new APIError('API not found', httpStatus.NOT_FOUND)));

export default server;