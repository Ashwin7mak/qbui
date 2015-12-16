'use strict';

var assert = require('assert');
var simpleStringify = require('./../utility/simpleStringify.js');
/**
 * Unit tests for User field formatting
 */
describe('Validate Simple Stringify Utility Functions', function() {

    it('validate simply objects are processed', function() {

        var obj = {
            str: 'str'
        };

        //  this should pass through with no changes
        var y = simpleStringify(obj);
        assert.equal(y, JSON.stringify(obj), 'Simplied object mismatch on simple object');
    });

    it('validate objects and functions are removed', function() {

        var testObj =  {
            str: 'str'
        };

        var objFunc = function() {
            return 'testObj';
        };

        var objCar = {
            make: 'Ford'
        };

        var obj = {
            func: objFunc,
            obj: objCar,
            str: 'str',
        };

        //  the returned object will strip out the object and function...
        var y = simpleStringify(obj);
        assert.equal(y, JSON.stringify(testObj), 'Simplied object mismatch on complex object');
    });

    it('validate inherited objects are removed', function() {

        var ObjCar = function() {};
        ObjCar.prototype.wheels = 4;

        var ObjBmw = new ObjCar();
        ObjBmw.foreign = true;

        //  the returned object will not include the inherited property from ObjCar
        var y = simpleStringify(ObjBmw);
        assert.equal(y, JSON.stringify({'foreign':true}), 'Simplied object mismatch on inherited object');
    });


});
