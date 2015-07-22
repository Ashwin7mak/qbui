'use strict';

describe('quickbase api service', function () {
    var qbUtility;

    beforeEach(function() {
        module('qbse.helper');
    });

    beforeEach(inject(function (_qbUtility_) {
        qbUtility = _qbUtility_;
    }));

    it('validate route arguments function', function () {
        var route = '/qbapp/report/apps/12345/tables/67890/report/14';
        var pattern = '/qbapp/report/apps/:appId/tables/:tableId/report/:id';
        expect(qbUtility.getRouteArguments(route, pattern)).toEqual({appId:'12345',tableId:'67890',id:'14'});

        route = '/a/mismatched/route';
        expect(qbUtility.getRouteArguments(route, pattern)).toEqual({});

        route = '/qbapp/report/apps/12345/tables/67890/report/14';
        pattern = '/qbapp/report/apps/12345/tables/tableId/report/1';
        expect(qbUtility.getRouteArguments(route, pattern)).toEqual({});

        expect(qbUtility.getRouteArguments(route)).toEqual({});
        expect(qbUtility.getRouteArguments()).toEqual({});

        expect(qbUtility.getRouteArguments('route', 'pattern')).toEqual({});
        expect(qbUtility.getRouteArguments('route', 'route')).toEqual({});

        expect(qbUtility.getRouteArguments('route', ':route')).toEqual({route:'route'});
    });

    it('Validate isInt function', function () {
        expect(qbUtility.isInt(0)).toBeTruthy();
        expect(qbUtility.isInt(3)).toBeTruthy();
        expect(qbUtility.isInt(33.7)).toBeFalsy();
        expect(qbUtility.isInt(-9)).toBeTruthy();
        expect(qbUtility.isInt(4E2)).toBeTruthy();
        expect(qbUtility.isInt('3')).toBeFalsy();
        expect(qbUtility.isInt('abc')).toBeFalsy();
        expect(qbUtility.isInt(true)).toBeFalsy();
        expect(qbUtility.isInt(false)).toBeFalsy();
        expect(qbUtility.isInt(null)).toBeFalsy();
        expect(qbUtility.isInt('')).toBeFalsy();
        expect(qbUtility.isInt()).toBeFalsy();
    });


    it('Validate map function', function () {
        var map = new qbUtility.map();

        //  initialize empty map
        expect(map.isEmpty()).toBeTruthy();
        expect(map.size()).toEqual(0);
        expect(map.get('key1')).toBeUndefined();

        //  add a new key
        map.put('key1', 'value1');
        expect(map.get('key1')).toBeDefined();
        expect(map.get('key1')).toEqual('value1');

        expect(map.containsKey('key1')).toBeTruthy();
        expect(map.containsKey('key2')).toBeFalsy();

        //  add a duplicate key..should overwrite existing entry.
        map.put('key1', 'value2');
        expect(map.size()).toEqual(1);
        expect(map.get('key1')).toEqual('value2');

        map.remove();
        expect(map.size()).toEqual(1);
        map.remove('key2');
        expect(map.size()).toEqual(1);
        map.remove('key1');
        expect(map.size()).toEqual(0);

        //  add 5 entries
        for (var i=0; i<5; i++) {
            map.put('key' + i, 'value' + i);
        }

        expect(map.size()).toEqual(5);

        var ctr=0;
        map.forEach( function(item, idx) {
            expect(idx).toEqual(ctr++);
            expect(item).toEqual('value'+idx);
        });
        expect(map.size()).toEqual(ctr);

        map.remove('key3');
        expect(map.size()).toEqual(4);
        expect(map.isEmpty()).toBeFalsy();

        //  ensure we have a new instance
        var map2 = new qbUtility.map();
        expect(map.size() !== map2.size()).toBeTruthy();

        map.clear();
        expect(map.isEmpty()).toBeTruthy();
        expect(map.size()).toEqual(0);

    });

});
