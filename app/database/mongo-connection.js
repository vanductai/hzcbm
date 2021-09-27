/*jslint node: true */
'use strict';

const mongoose = require('mongoose');
const NODE_ENV = process.env;
const config = {
  db: {
    host: NODE_ENV.DB_SERVER,
    user: NODE_ENV.DB_USER,
    pass: NODE_ENV.DB_PASSWORD,
    port: NODE_ENV.DB_PORT,
    name: NODE_ENV.DB_NAME,
  }
};

module.exports = function (app, onOpenCallback, onErrorCallback) {
  let username = config.db.user;
  let password = config.db.pass;
  let uri = ''.concat(`mongodb://`, config.db.host, ':', config.db.port, '/', config.db.name);

  /** 
   * Connect to MongoDB via Mongoose
   */
  const opts = {
    promiseLibrary: global.Promise,
    config: {
      autoIndex: true,
    },
    user: username,
    pass: password,
    useNewUrlParser: true,
  };
  // console.log(opts);

  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = opts.promiseLibrary;


  const db = mongoose.connection;

  db.on('error', (err) => {
    // console.log('MONGO CONNECTION ERROR: ', err);
    console.log("Mongo connection error: " + err, true);
    if (onErrorCallback != undefined) {
      onErrorCallback(err)
    }
    if (err.message.code === 'ETIMEDOUT') {
      // log.error("Mongo connection error", err);
      console.log("Mongo connection timeout: " + err, true)
      mongoose.connect(uri, opts);
    }
  });

  db.once('open', () => {
    console.log(uri, "Mongo connected at uri");
    app.db = db;
    if (onOpenCallback != undefined) {
      onOpenCallback();
    }
  });

  mongoose.connect(uri, opts);
};
