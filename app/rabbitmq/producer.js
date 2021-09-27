const amqp = require('amqplib');

function Producer(delayExchange = 'delay-exchange', topicExchange = 'topic-exchange', normalQueue = 'normal') {
    this.delayExchange = delayExchange;
    this.topicExchange = topicExchange;
    this.normalQueue = normalQueue;
    this.connection = null;
    this.isConnected = false;
    this.channel = null;
}

Producer.prototype.init = function (host, port, username, passsword) {
    const connectOpts = {
        protocol: "amqp",
        hostname: host,
        port: port,
        username: username,
        password: passsword,
    };

    return amqp.connect(connectOpts).then(conn => {
        this.connection = conn;
        this.isConnected = true;

        return this.connection.createChannel();
    }).then(channel => {
        this.channel = channel;

        const promises = [];

        if (this.delayExchange) {
            promises.push(this.createDelayExchange());
        }

        if (this.topicExchange) {
            promises.push(this.createTopicExchange());
        }

        if (this.normalQueue) {
            promises.push(this.createNormalQueue())
        }

        return Promise.all(promises);
    }).then(() => {
        if (this.delayExchange && this.normalQueue) {
            return this.channel.bindQueue(this.normalQueue, this.delayExchange, this.normalQueue);
        }
    });
};


/**
 * 
 */
Producer.prototype.createDelayExchange = function () {
    if (!this.channel) {
        throw new Error('channel is not exist');
    }

    return this.channel.assertExchange(this.delayExchange, 'direct', {
        autoDelete: false,
        durable: true,
        passive: true,
        arguments: {
            'x-delayed-type': 'direct',
        }
    });
};


/**
 * Create topic exchange
 * 
 */
Producer.prototype.createTopicExchange = function () {
    if (!this.channel) {
        throw new Error('channel is not exist');
    }

    return this.channel.assertExchange(this.topicExchange, 'topic', {
        autoDelete: false,
        durable: true,
        passive: true,
    });
};


/**
 * 
 */
Producer.prototype.createNormalQueue = function () {
    return this.channel.assertQueue(this.normalQueue, {
        // By mark queue durable
        // Rabbit will never lose our queue 
        // when crash or quit
        durable: true,
    });
};


Producer.prototype.buildMessage = function (data) {
    const dataString = JSON.stringify(data);
    return new Buffer.from(dataString);
};


Producer.prototype.enqueue = function (data) {
    if (!this.channel) {
        throw new Error('channel is not exist');
    }

    if (!this.normalQueue) {
        throw new Error('normal queue is not exist');
    }

    const buffer = this.buildMessage(data);
    const options = { persistent: true }; // save message to disk
    return this.channel.sendToQueue(this.normalQueue, buffer, options);
};

Producer.prototype.enqueueDelayMessage = function (data, delay) {
    if (!this.channel) {
        throw new Error('channel is not exist');
    }

    if (!this.delayExchange) {
        throw new Error('delayExchange is not exist');
    }

    const buffer = this.buildMessage(data);

    const options = {
        // save message to disk
        persistent: true,

        headers: {
            "x-delay": delay
        }
    };

    return this.channel.publish(this.delayExchange, this.normalQueue, buffer, options);
};

exports.Producer = Producer;
exports.producer = new Producer();
exports.customizeProducer = {};
exports.createCustomizeProducer = function (host, port, username, passsword, queue, delayExchange = null) {
    const customizeProducer = new Producer(delayExchange, null, queue);
    return customizeProducer.init(host, port, username, passsword).then(() => {
        exports.customizeProducer[queue] = customizeProducer;
        return customizeProducer;
    });
};
