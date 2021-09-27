
const InternalRequestBuilder = require('./internal-request-builder').InternalRequestBuilder;

/**
 * Create variant hrv request builder base endpoint request
 * builder
 */
function createBuilder() {
    return new InternalRequestBuilder()
        .withVersion('v1')
        .withPath('queue');
};
exports.createBuilder = createBuilder;

/**
 * Create variant hrv request builder base endpoint request
 * builder
 */
function createLocalBuilder() {
    return new InternalRequestBuilder()
        .withVersion('v1')
};
exports.createLocalBuilder = createLocalBuilder;

/**
 * 
 */
function getSaleOrderDetailQueueOption(salesorder_id) {
    var body = {
        salesorder_id: salesorder_id,
    }
    return createBuilder().withPath('getSaleOrderDetail').makePOST(body).build();
}
exports.getSaleOrderDetailQueueOption = getSaleOrderDetailQueueOption;


/**
 * 
 */
function getContactDetailQueueOption(params) {
    return createLocalBuilder().withPath('getContactZohoDetail').makeGet(params).build();
}
exports.getContactDetailQueueOption = getContactDetailQueueOption;

/**
 * 
 */
function createPaymentQueueOption(params) {
    return createLocalBuilder().withPath('createPayment').makePOST(params).build();
}
exports.createPaymentQueueOption = createPaymentQueueOption;




