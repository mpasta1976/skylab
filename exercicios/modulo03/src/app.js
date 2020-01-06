import 'dotenv/config';

import express from 'express';
import path from 'path';
import 'express-async-errors';
import youch from 'youch';
import './database';
import * as Sentry from '@sentry/node';
import routes from './routes';

import sentryConfig from './config/sentry';


class App {
  constructor() {
    this.server = express();

    Sentry.init({
      dsn: 'https://69cd46eb2a8e454abf65546f90bed24b@sentry.io/1872105',
    });

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);

    this.server.use(
      // The error handler must be before any other error middleware and after all controllers
      Sentry.Handlers.errorHandler()
    );
  }

  exceptionHandler() {
    // Optional fallthrough error handler
    this.server.use(async (err, req, res, next ) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({error: 'Internal server error'});
    });
  }
}

export default new App().server;
