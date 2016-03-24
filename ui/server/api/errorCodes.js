/*
 * This module contains the error codes shared between server/node and node/client.
 * The client code send by node to the client is expected to be interpreted by the client and acted upon appropriately.
 */
(function() {
    'use strict';
    module.exports = Object.freeze({
        UNKNOWN: 999999
    });
}());
