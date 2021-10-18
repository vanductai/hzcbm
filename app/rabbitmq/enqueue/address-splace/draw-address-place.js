const {Producer} = require('../../../rabbitmq');
const customizeProducer = Producer.customizeProducer;
const RequestBuilder = require('../../../request-builder');;
const InternalQueueRp = RequestBuilder.InternalQueueRp;
exports.enqueueDrawAddressPlace = function (delay = 0) {
    var data = InternalQueueRp
        .createBuilder()
        .withPath('draw')
        .withPath('address-place')
        .makePOST({})
        .build();
    customizeProducer.hzcbm01.enqueueDelayMessage(data, delay);
};