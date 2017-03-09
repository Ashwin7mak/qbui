const BaseClientRoute = require('../../src/routes/clientRoutes/baseClientRoute');
const baseClientPath = require('../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;
const sinon = require('sinon');
const assert = require('assert');

const mockExpressApp = {route(_path) { return {get(_callback) {}}}};

describe('BaseClientRoute', () => {
    beforeEach(() => {
        sinon.spy(mockExpressApp, 'route');
    });

    afterEach(() => {
        mockExpressApp.route.restore();
    });

    describe('new', () => {
        it('attaches a new route to the app', () => {
            const testPath = '/testpath';
            new BaseClientRoute(mockExpressApp, {}, testPath);

            assert(mockExpressApp.route.calledOnce);
        });

        it('adds the base client route to all paths', () => {
            const testPath = '/testpath';
            new BaseClientRoute(mockExpressApp, {}, testPath);

            assert(mockExpressApp.route.calledWith(`${baseClientPath}${testPath}`));
        });

        it('adds the required backslash(/) if one is not provided as part of the path', () => {
            const testPath = 'testpath';
            new BaseClientRoute(mockExpressApp, {}, testPath);

            assert(mockExpressApp.route.calledWith(`${baseClientPath}/${testPath}`));
        });
    });

    describe('addRoutesFromArrayOfPaths', () => {
        it('adds an array of paths to the express app', () => {
            const testPaths = [
                '/testA',
                '/testB',
                '/testC/:hasVariable/route'
            ];

            BaseClientRoute.addRoutesFromArrayOfPaths(mockExpressApp, {}, testPaths);

            testPaths.forEach((path, index) => {
                assert.equal(mockExpressApp.route.getCall(index).args[0], `${baseClientPath}${path}`);
            });
        });
    });
});