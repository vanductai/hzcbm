const rp = require('request-promise');
const amqp = require('amqplib');
const { Utilities } = require('../common');
const RABBIT_C_USER_NAME = process.env.RABBIT_C_USER_NAME;
const RABBIT_C_PASS = process.env.RABBIT_C_PASS;
const RABBIT_HOST = process.env.RABBIT_HOST;
const RABBIT_PORT = process.env.RABBIT_PORT;

/**
 * @constructor
 * 
 * @param {string} url
 * @param {string} queue 
 * @param {Boolean} noAck
 * @param {string} delayExchange
 */
function Worker(url, queue, delayExchange = null, noAck = false, prefetch = null) {
    this.url = url;
    this.queue = queue;
    this.noAck = noAck;
    this.delayExchange = delayExchange;
    this.channel = null;
    this.prefetch = prefetch;
}

Worker.prototype.connect = function () {
    return amqp.connect(this.url).then(conn => {
        return conn.createChannel();
    }).then(channel => {
        this.channel = channel;

        if (this.prefetch) {
            this.channel.prefetch(this.prefetch);
        }

        return this.onCreatedChannel();
    }).then(() => {
        return this;
    });
};


Worker.prototype.onCreatedChannel = function () {
    return Promise.resolve();
};


Worker.prototype.enqueueDelayMessage = function (data, delay) {
    if (!this.delayExchange) {
        throw new Error('delay exchange is empty');
    }

    const dataString = JSON.stringify(data);
    const buffer = new Buffer.from(dataString);

    const options = {
        // save message to disk
        persistent: true,

        headers: {
            "x-delay": delay
        }
    };

    return this.channel.publish(this.delayExchange, this.queue, buffer, options);
};


Worker.prototype.parseMessageContent = function (msg) {
    const contentString = msg.content.toString();
    return JSON.parse(contentString);
};


Worker.prototype.messageHandler = function (msg) {
    var content = this.parseMessageContent(msg);
    const headers = content.headers;
    const isDebug = headers['X-HXCBM-DEBUG'] || false;
    const retryLimit = headers['X-HXCBM-RETRY-LIMIT'];
    const retryCount = headers['X-HXCBM-RETRY-COUNT'];
    const backoff = headers['X-HXCBM-RETRY-BACK-OFF']; // milisecond

    if (isDebug) {
        console.log({
            content: Utilities.deleteMongooField(content, ['body']),
        }, 'Service worker - message handler - content')
    }

    rp(content).then(res => {
        if (isDebug) {
            console.log({
                res: res
            }, 'Service worker - message handler - response');
        }

        this.channel.ack(msg);
    }).catch(err => {
        console.log(err.error, 'Service worker - message handler - error');
        console.log({
            content: Utilities.deleteMongooField(content, ['body'])
        }, 'Service worker - message handler - error');

        if (retryLimit !== undefined && retryCount !== undefined && backoff !== undefined) {
            if (isDebug) {
                console.log({
                    retryLimit: retryLimit,
                    retryCount: retryCount,
                    backoff: backoff,
                }, 'Retry info');
            }

            if (retryLimit > retryCount) {
                content.headers['X-HXCBM-RETRY-COUNT'] = retryCount + 1;
                this.enqueueDelayMessage(content, backoff);
            }
        }
        this.channel.ack(msg);
    });
};


Worker.prototype.consume = function () {
    const options = {
        noAck: this.noAck,
    };

    return this.channel.consume(
        this.queue,
        this.messageHandler.bind(this),
        options
    );
};


exports.createWorker = function (queue = 'normal', delayExchange = 'delay-exchange') {
    const rabbitUrl = `amqp://${RABBIT_C_USER_NAME}:${RABBIT_C_PASS}@${RABBIT_HOST}:${RABBIT_PORT}`;
    // console.log(rabbitUrl);
    const worker = new Worker(rabbitUrl, queue, delayExchange, false);
    return worker.connect().then(() => {
        return worker.consume();
    });
};


exports.createCustomizeWorker = function (queue, delayExchange = null, prefetch = 1, host = RABBIT_HOST, port = RABBIT_PORT, username = RABBIT_C_USER_NAME, password = RABBIT_C_PASS) {
    const rabbitUrl = `amqp://${username}:${password}@${host}:${port}`;
    // console.log(rabbitUrl);
    const worker = new Worker(rabbitUrl, queue, delayExchange, false, prefetch);
    return worker.connect().then(() => {
        return worker.consume();
    });
};