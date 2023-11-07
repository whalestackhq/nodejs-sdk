#!/usr/bin/env node
const axios = require('axios').default;
const crypto = require('crypto');

/**
 * NodeJS implementation of a REST client for the Whalestack Payments API
 * see https://www.whalestack.com/en/api-docs
 *
 * @constructor, initialize this with the API key and secret as given by https://www.whalestack.com/en/api-settings
 *
 * @param key (string) Your Whalestack API Key
 * @param secret (string) Your Whalestack API Secret
 */
function Client(key, secret) {

    // @string The API Key as given by https://www.whalestack.com/en/api-settings
    this.key = key;

    // @string The API Secret as given by https://www.whalestack.com/en/api-settings
    this.secret = secret;

    // @string The current version of this SDK, used in the HTTP user agent (leave it as is)
    this.clientVersion = require('../package.json').version;

    // @string Used in the HTTP user agent (leave it as is)
    this.clientName = 'nodejs-sdk';

    // @string The API version to which we connect (leave it as is)
    this.apiVersion = 'v1';

    /**
     * Use this method to communicate with GET endpoints
     *
     * @param endpoint (string), e.g. /blockchains
     * @param params (object), a list of GET parameters to be included in the request
     */
    this.get = async function(endpoint, params) {
        return await sendRequest('get', endpoint, params);
    };

    /**
     * Use this method to communicate with POST endpoints
     *
     * @param endpoint (string), e.g. /checkout/hosted
     * @param params (object), a list of POST parameters to be included in the request
     */
    this.post = async function(endpoint, params) {
        return await sendRequest('post', endpoint, params);
    };

    /**
     * Use this method to communicate with PUT endpoints
     *
     * @param endpoint (string), e.g. /checkout/hosted
     * @param params (object), a list of PUT parameters to be included in the request
     */
    this.put = async function(endpoint, params) {
        return await sendRequest('put', endpoint, params);
    };

    /**
     * Use this method to communicate with DELETE endpoints
     *
     * @param endpoint (string), e.g. /checkout/hosted
     * @param params (object), a list of DELETE parameters to be included in the request
     */
    this.delete = async function(endpoint, params) {
        return await sendRequest('delete', endpoint, params);
    };

    // private validator function
    const validateArgs = function(method, endpoint, params) {

        if (!validateEndpoint(endpoint)) {
            this.log("Invalid endpoint given to " + method + " method.");
            return false;
        }

        if (!validateParams(params)) {
            this.log("Invalid params given to " + method + " method.");
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

    // private function to build request configuration
    const buildConfig = function(extras) {

        // build auth signature
        let timestamp = Date.now() / 1000 | 0;
        let signature = crypto.createHmac('sha256', this.secret).update(extras.url + timestamp.toString() + extras.method.toUpperCase() + (extras.method === 'get' ? '' : JSON.stringify(extras.data))).digest('hex');

        // build request config
        return Object.assign({
            baseURL: 'https://www.whalestack.com/api/' + this.apiVersion + '/',
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
    const sendRequest = async function(method, endpoint, params) {

        if (!validateArgs(method, endpoint, params)) {
            return;
        }

        try {
            return await axios(buildConfig({
                method: method,
                url: endpoint,
                params: method === 'get' ? params : null,
                data: method === 'get' ? null : params
            }));
        } catch (e) {
            this.log(JSON.stringify(e));
            return e.response;
        }

    }.bind(this);

    /**
     * Normalized Logging for Whalestack SDK related events and errors.
     * @param message
     */
    this.log = function(message) {
        console.log(new Date().toISOString() + ' [Whalestack]: ' + message)
    };

}

module.exports = Client;

