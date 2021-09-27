/*jslint node: true */
'use strict';
const restify = require('restify');
const {Constants} = require('./app/common');
const RabbitMQ = require('./app/rabbitmq');
const Producer = RabbitMQ.Producer;
const ServiceWorker = RabbitMQ.ServiceWorker;
const TeleBot = require('./app/telebot');

var app;

function initApp() {
  app = restify.createServer({
    name: 'hz-cbm',
    versions: ['v1']
  });
  app.versions = ['v1'];

  app.listen(process.env.NODE_PORT, function () {
    console.log('Start app finish');
    connectMongoDatabase();
  });
  require('./app/prototype/index')(app);
}


function connectMongoDatabase() {
  require('./app/database/mongo-connection')(app,
    async function onOpen() {
      require('./app/routes/')(app);
      /**
       * Importance
       */
      var IS_READY = process.env.IS_READY;
      var isReady = true;
      if (IS_READY != undefined && IS_READY == 'false') {
        isReady = false;
      }

      if (isReady) {

      } else {
        console.log(`not ready to create queue job`);
      }

      const RABBIT_P_USER_NAME = process.env.RABBIT_P_USER_NAME;
      const RABBIT_P_PASS = process.env.RABBIT_P_PASS;
      const RABBIT_HOST = process.env.RABBIT_HOST;
      const RABBIT_PORT = process.env.RABBIT_PORT;

      /**
       * Init rabbit
       * Create producer
       */
      await Promise.all([
        Producer.producer.init(
          RABBIT_HOST, RABBIT_PORT,
          RABBIT_P_USER_NAME, RABBIT_P_PASS,
        ),
        Producer.createCustomizeProducer(
          RABBIT_HOST, RABBIT_PORT,
          RABBIT_P_USER_NAME, RABBIT_P_PASS,
          Constants.RABBIT_CONST.HZCBM.queue_name, Constants.RABBIT_CONST.HZCBM.exchange_name
        ),
        Producer.createCustomizeProducer(
          RABBIT_HOST, RABBIT_PORT,
          RABBIT_P_USER_NAME, RABBIT_P_PASS,
          Constants.RABBIT_CONST.HZCBM_01.queue_name, Constants.RABBIT_CONST.HZCBM_01.exchange_name
        )
      ]);

      /**
       * Create worker
       * Đặt tên gì đó tùy thích
       */
      await Promise.all([
        ServiceWorker.createWorker(),
        ServiceWorker.createCustomizeWorker(
          Constants.RABBIT_CONST.HZCBM.queue_name, Constants.RABBIT_CONST.HZCBM.exchange_name, 1,
          RABBIT_HOST, RABBIT_PORT,
          RABBIT_P_USER_NAME, RABBIT_P_PASS
        ),
        ServiceWorker.createCustomizeWorker(
          Constants.RABBIT_CONST.HZCBM_01.queue_name, Constants.RABBIT_CONST.HZCBM_01.exchange_name, 1,
          RABBIT_HOST, RABBIT_PORT,
          RABBIT_P_USER_NAME, RABBIT_P_PASS
        )
      ]);
      const teleBot = TeleBot.init(app);
    },
    function onError(err) {
      console.error('Connection mongo error: ', err);
    });
}

function main() {
  initApp();
}

try {
  main()
}
catch (error) {
  console.log(error, 'APP ERROR');
}