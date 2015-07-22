describe('Module quickbase.app module run function', function() {
    'use strict';

    var appId = '12345';
    var tableId = '67890';
    var reportId = '12';
    var qbUtility;

    beforeEach(function() {
        module('qbse.helper');
    });
    beforeEach(inject(function (_qbUtility_) {
        qbUtility = _qbUtility_;
    }));

    var stateMock = {
        transitionTo: function() {}
    };
    var locationMock = {
        path: function() {}
    };

    it('test app.module run block with default route', function() {
        var runBlock = getRunBlock();

        spyOn(stateMock, 'transitionTo').and.callFake(function() {
            return null;
        });
        spyOn(locationMock, 'path').and.callFake(function() {
            return '/qbapp';
        });

        runBlock(stateMock, locationMock);

        expect(locationMock.path).toHaveBeenCalled();
        expect(stateMock.transitionTo).toHaveBeenCalledWith('qbapp');
    });

    it('test app.module run block with report route', function() {
        var runBlock = getRunBlock();

        spyOn(stateMock, 'transitionTo').and.callFake(function() {
            return null;
        });
        spyOn(locationMock, 'path').and.callFake(function() {
            return '/qbapp/report/apps/' + appId + '/tables/' + tableId + '/report/' + reportId;
        });

        runBlock(stateMock, locationMock, qbUtility);

        expect(locationMock.path).toHaveBeenCalled();
        expect(stateMock.transitionTo).toHaveBeenCalledWith('report',{appId:appId,tableId:tableId,id:reportId});
    });

    it('test app.module run block with an invalid route', function() {
        var runBlock = getRunBlock();

        spyOn(stateMock, 'transitionTo');
        spyOn(locationMock, 'path').and.callFake(function() {
            return '/some/invalid/route';
        });

        runBlock(stateMock, locationMock, qbUtility);

        expect(locationMock.path).toHaveBeenCalled();
        expect(stateMock.transitionTo).toHaveBeenCalledWith('qbapp');
    });

    it('test app.module run block with no route', function() {
        var runBlock = getRunBlock();

        spyOn(stateMock, 'transitionTo');
        spyOn(locationMock, 'path').and.callFake(function() {
            return null;
        });

        runBlock(stateMock, locationMock, qbUtility);

        expect(locationMock.path).toHaveBeenCalled();
        expect(stateMock.transitionTo).toHaveBeenCalledWith('qbapp');
    });


    function getRunBlock() {
        var module = angular.module('quickbase.qbapp');
        return module._runBlocks[0][module._runBlocks[0].length-1];
    }

});
