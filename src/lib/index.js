#!/usr/bin/env node
const axios = require('axios').default;
const crypto = require('crypto');

/**
 * NodeJS implementation of a REST client for the COINQVEST Merchant API
 * see https://www.coinqvest.com/en/api-docs
 *
 * @constructor, initialize this with the API key and secret as given by https://www.coinqvest.com/en/api-settings
 *
 * @param key (string) Your COINQVEST API Key
 * @param secret (string) Your COINQVEST API Secret
 */
function Client(key, secret) {

    // @string The API Key as given by https://www.coinqvest.com/en/api-settings
    this.key = key;

    // @string The API Secret as given by https://www.coinqvest.com/en/api-settings
    this.secret = secret;

    // @string The current version of this SDK, used in the HTTP user agent (leave it as is)
    this.clientVersion = '0.0.1'; // good way to pull this from package.json instead?

    // @string Used in the HTTP user agent (leave it as is)
    this.clientName = 'nodejs-merchant-sdk';

    // @string The API version to which we connect (leave it as is)
    this.apiVersion = 'v1';

    /**
     * Use this method to communicate with GET endpoints
     *
     * @param endpoint (string), e.g. /blockchains
     * @param params (object), a list of GET parameters to be included in the request
     * @param callback (function), processes the response
     */
    this.get = function(endpoint, params, callback) {
        sendRequest('get', endpoint, params, callback);
    };

    /**
     * Use this method to communicate with POST endpoints
     *
     * @param endpoint (string), e.g. /checkout/hosted
     * @param params (object), a list of POST parameters to be included in the request
     * @param callback (function), processes the response
     */
    this.post = function(endpoint, params, callback) {
        sendRequest('post', endpoint, params, callback);
    };

    /**
     * Use this method to communicate with PUT endpoints
     *
     * @param endpoint (string), e.g. /checkout/hosted
     * @param params (object), a list of PUT parameters to be included in the request
     * @param callback (function), processes the response
     */
    this.put = function(endpoint, params, callback) {
        sendRequest('put', endpoint, params, callback);
    };

    /**
     * Use this method to communicate with DELETE endpoints
     *
     * @param endpoint (string), e.g. /checkout/hosted
     * @param params (object), a list of DELETE parameters to be included in the request
     * @param callback (function), processes the response
     */
    this.delete = function(endpoint, params, callback) {
        sendRequest('delete', endpoint, params, callback);
    };

    // private validator function
    const validateArgs  = function(method, endpoint, params, callback) {

        if (!validateEndpoint(endpoint)) {
            this.log("Invalid endpoint given to " + method + " method.");
            return false;
        }

        if (!validateParams(params)) {
            this.log("Invalid params given to " + method + " method.");
            return false;
        }

        if (!validateCallback(callback)) {
            this.log("Invalid callback given to " + method + " method.");
            return false;
        }

        return true;

    }.bind(this);

    // private validator function
    const validateEndpoint = function(endpoint) {
        return typeof endpoint === 'string' && endpoint.substring(0,1) === '/';
    };

    // private validator function
    const validateParams = function(params) {

        if (typeof params === 'object') {
            return true;
        }

        return !params;

    };

    // private validator function
    const validateCallback = function(callback) {
        return typeof callback === 'function';
    };

    // private function to build request configuration
    const buildConfig = function(extras) {

        // build auth signature
        let timestamp = Date.now() / 1000 | 0;
        let signature = crypto.createHmac('sha256', this.secret).update(extras.url + timestamp.toString() + extras.method.toUpperCase() + (extras.method === 'get' ? '' : JSON.stringify(extras.data))).digest('hex');

        // build request config
        return Object.assign({
            baseURL: 'https://www.coinqvest.com/api/' + this.apiVersion + '/',
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: {
                'User-Agent': this.clientName + ' ' + this.clientVersion,
                'Accept': 'application/json',
                'X-Digest-Key': this.key,
                'X-Digest-Signature': signature,
                'X-Digest-Timestamp': timestamp
            }
        }, extras);

    }.bind(this);

    // private function to send the request
    const sendRequest = function(method, endpoint, params, callback) {

        if (!validateArgs(method, endpoint, params, callback)) {
            return;
        }

        axios(buildConfig({
            method: method,
            url: endpoint,
            params: method === 'get' ? params : null,
            data: method === 'get' ? null : params
        }))
        .then(callback)
        .catch(function(e) {
            this.log(JSON.stringify(e));
            callback(e.response);
        }.bind(this));

    }.bind(this);

    /**
     * Normalized Logging for COINQVEST SDK related events and errors.
     * @param message
     */
    this.log = function(message) {
        console.log(new Date().toISOString() + ' [COINQVEST]: ' + message)
    };

}

module.exports = Client;

