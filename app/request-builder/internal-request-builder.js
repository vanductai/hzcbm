const RequestBuilder = require('./request-builder').RequestBuilder;
const { Helper, Constants } = require('../common');


/**
 * This class's used to construct internal request
 * between's services 
 * 
 */
class InternalRequestBuilder extends RequestBuilder {

    /**
     * Constructor function
     * auto append basic authen
     */
    constructor() {
        super(process.env.NODE_HOST, process.env.NODE_PORT, 'http');

        const env = process.env;
        const BASIC_AUTH_USER = env.INTERNAL_BASIC_AUTH_USERNAME;
        const BASIC_AUTH_PASS = env.INTERNAL_BASIC_AUTH_PASSWORD;
        const authorization = Helper.generateBasicAuthString(BASIC_AUTH_USER, BASIC_AUTH_PASS);
        this.headers = {
            Authorization: authorization,
        };
        this.headers[Constants.HZ_TRUSTED_KEY] = process.env.HZ_TRUSTED_KEY;
    }
}

module.exports = {
    InternalRequestBuilder
}