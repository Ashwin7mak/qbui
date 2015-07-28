describe('Module quickbase.app module run function', function() {
    'use strict';

    var stateMock = {
        transitionTo: function() {}
    };

    it('test app.module run block', function() {
        var runBlock = getRunBlock();

        spyOn(stateMock, 'transitionTo').and.callFake(function() {
            return null;
        });

        runBlock(stateMock);

        expect(stateMock.transitionTo).toHaveBeenCalledWith('qbapp');
    });

    function getRunBlock() {
        var module = angular.module('quickbase.qbapp');
        return module._runBlocks[0][module._runBlocks[0].length-1];
    }

});
