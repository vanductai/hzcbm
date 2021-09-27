/*jslint node: true */
'use strict';
const fs = require('fs');
const restify = require('restify');
const Common = require('../common');
const Constants = Common.Constants;
const Helper = Common.Helper;


module.exports = function (app) {
  app.localhostIps = Helper.localhostRangeIp();
  app.pre(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    if (process.env.NODE_ENV == Constants.ENV_DEV) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // console.log(req.connection.remoteAddress);

    const clientIp = Helper.getRemoteIp(req);

    console.log(`\x1b[36m${req.url}\x1b[0m from ${clientIp}`);
    // console.log(`\x1b[36m---------------------${title}:\x1b[0m`);

    next();
  });

  var versioning = require('../middlewares/versioning')({ prefix: '/api' }, app);
  app.pre(versioning);
  app.use(restify.plugins.bodyParser({ mapParams: true }));
  app.use(restify.plugins.acceptParser(app.acceptable));
  app.use(restify.plugins.queryParser({ mapParams: true }));
  app.use(restify.plugins.fullResponse());

  app.on('uncaughtException', function (req, res, route, err) {
    console.log('******* Begin Error *******\n%s\n*******\n%s\n******* End Error *******', route, err.stack);
    if (!res.headersSent) {
      return res.send(500, { ok: false });
    }
    res.write('\n');
    res.end();
  });

  fs.readdirSync('./app/routes').forEach(function (file) {
    if (file.substr(-3, 3) === '.js' && file !== 'index.js') {
      require('./' + file.replace('.js', ''))(app);
    } else if (file !== 'index.js') {
      require('./' + file).route(app);
    }
  });

  app.get('/', function (req, res, next) {
    res.send('HZ-CBM');
    return next();
  });

  app.on('after', function (req, res, name) {
    // req.log.info('%s just finished: %d.', name, res.code);
  });
};
