describe('Module quickbase.app module run function', function() {
    'use strict';

    beforeEach(function() {
        module('qbse.helper');
    });

    it('test app.module run block with report route', function() {
        var runBlock = getRunBlock();
        expect(runBlock).not.toBeDefined();
    });

    function getRunBlock() {
        var module = angular.module('quickbase.report');
        return module._runBlocks[0] ? module._runBlocks[0][module._runBlocks[0].length - 1] : undefined;
    }

});
