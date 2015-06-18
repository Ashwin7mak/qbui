'use strict';

var log = require('../logger').getLogger('unitTest');

describe('qbse logger', function () {

    it('test logger is a function', function() {
        expect(log.getLogger).toBeDefined();
    });

});
