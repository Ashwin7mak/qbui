/*
 * This module contains global shared constant values for the server
 */
(function() {
    'use strict';
    module.exports = Object.freeze({
        PRODUCTION : 'PRODUCTION',
        PRE_PROD   : 'PRE_PROD',
        INTEGRATION: 'INTEGRATION',
        DEVELOPMENT: 'DEVELOPMENT',
        TEST       : 'TEST',
        LOCAL      : 'LOCAL',
        //  START TEMPORARY -- while we support Angular lighthouse..
        REACT      : 'REACT'
        //  END TEMPORARY
    });

}());