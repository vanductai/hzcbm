const URL = require('url').URL;
const Path = require('path');
const Common = require('../common');

/**
 * Restfull request builder
 * this class will contruct request object
 */
class RequestBuilder {

    /**
     * Constructor function
     * 
     * @param {string} hostname request host name
     * @param {string} port request port (can ignore)
     * @param {string} protocol protocol, default is https
     */
    constructor(hostname, port, protocol = 'https') {
        if (!hostname) {
            throw new Error('error_invalid_hostname');
        }

        if (!protocol) {
            throw new Error('error_invalid_protocol');
        }

        this.hostname = hostname;
        this.port = port;
        this.protocol = protocol;
        this.json = true;
        this.path = '';
        this.version = '';
    }


    /**
     * Make a GET request
     * 
     * @param {Object} qs request' query string
     */
    makeGet(qs) {
        this.method = 'GET';
        this.qs = qs;
        return this;
    }


    /**
     * Make POST request
     * 
     * @param {Object} body request's body
     */
    makePOST(body, qs) {
        this.method = 'POST';
        this.body = body;
        this.qs = qs;
        return this;
    }


    /**
     * Make PUT request
     * 
     * @param {Object} body request's body
     */
    makePUT(body, qs) {
        this.method = 'PUT';
        this.body = body;
        this.qs = qs;
        return this;
    }


    /**
     * Make DELETE request
     * 
     * @param {Object} body request's body
     */
    makeDELETE(body, qs) {
        this.method = 'DELETE';
        this.body = body;
        this.qs = qs;
        return this;
    }


    /**
     * This version will add to request's pathname
     * when build function called
     * 
     * @param {string} version api version
     */
    withVersion(version) {
        this.version = version;
        return this;
    }


    /**
     * This function can be call multiple time
     * to append path to full path
     * 
     * @param {string} path path
     */
    withPath(path) {
        let newPath = Path.join(this.path, path.toString());
        newPath = Path.normalize(newPath);
        this.path = newPath;
        return this;
    }


    /**
     * Use this function to add custom header
     * 
     * @param {Object} headers request's header
     */
    withHeaders(headers) {
        if (this.headers) {
            Object.keys(headers).forEach(key => {
                const value = headers[key];
                this.headers[`${key}`] = value;
            });
        } else {
            this.headers = headers;
        }
        return this;
    }


    withRetryOptions(retryLimit, backOff) {
        const options = {};
        options['HZ-RETRY-LIMIT'] = retryLimit;
        options['HZ-RETRY-COUNT'] = 0;
        options['HZ-RETRY-BACK-OFF'] = backOff;
        return this.withHeaders(options);
    }


    enableDebug() {
        const options = {};
        options['HZ-DEBUG'] = true;
        return this.withHeaders(options);
    }


    /**
     * This function will return full request object
     * from multiple part of this class
     */
    build() {
        if (!this.method) {
            throw new Error('error_invalid_method');
        }

        const url = new URL('https://example.com');
        url.protocol = this.protocol;
        url.hostname = this.hostname;
        if (this.port) {
            url.port = this.port;
        }

        let pathname = Path.join(this.version, this.path);
        pathname = Path.normalize(pathname);
        url.pathname = pathname;

        const options = {
            uri: url.href,
            method: this.method,
            json: this.json,
        };

        if (this.headers) {
            options.headers = this.headers;
        }

        if (this.body) {
            options.body = this.body;
        }

        if (this.qs) {
            options.qs = this.qs;
        }
        options.timeout = Common.Constants.TIMEOUT_REQUEST;
        return options;
    }
}

module.exports = {
    RequestBuilder
}