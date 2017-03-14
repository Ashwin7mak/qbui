const BaseClientRoute = require('../../src/routes/baseClientRoute');
const baseClientPath = require('../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;
const sinon = require('sinon');
const assert = require('assert');

const mockExpressApp = {route(_path) {return {get(_callback) {}};}};

let baseClientRoute;

describe('BaseClientRoute', () => {
    beforeEach(() => {
        baseClientRoute = new BaseClientRoute(mockExpressApp, {}, {});
        sinon.spy(mockExpressApp, 'route');
    });

    afterEach(() => {
        mockExpressApp.route.restore();
    });

    describe('addRoute', () => {
        it('attaches a new route to the app', () => {
            const testPath = '/testpath';
            baseClientRoute.addRoute(testPath);

            assert(mockExpressApp.route.calledOnce);
        });

        it('adds the base client route to all paths', () => {
            const testPath = '/testpath';
            baseClientRoute.addRoute(testPath);

            assert(mockExpressApp.route.calledWith(`${baseClientPath}${testPath}`));
        });

        it('adds the required backslash(/) if one is not provided as part of the path', () => {
            const testPath = 'testpath';
            baseClientRoute.addRoute(testPath);

            assert(mockExpressApp.route.calledWith(`${baseClientPath}/${testPath}`));
        });

        it('does not add a backslash to a blank route (allows route /qbase to be set)', () => {
            const testPath = '';
            baseClientRoute.addRoute(testPath);

            assert(mockExpressApp.route.calledWith(baseClientPath));
        });
    });

    describe('addRoutesFromArrayOfPaths', () => {
        it('adds an array of paths to the express app', () => {
            const testPaths = [
                '/testA',
                '/testB',
                '/testC/:hasVariable/route'
            ];

            baseClientRoute.addRoutesFromArrayOfPaths(testPaths);

            testPaths.forEach((path, index) => {
                assert.equal(mockExpressApp.route.getCall(index).args[0], `${baseClientPath}${path}`);
            });
        });
    });

    describe('generateBundleFilePath', () => {
        const testBundleName = 'bundle';

        it('returns the correct name for non-production environments', () => {
            const mockAppConfig = {isProduction: false};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});

            assert.equal(baseClientRoute.generateBundleFilePath(testBundleName), `${testBundleName}.js`);
        });

        it('returns the correct name for the production environment', () => {
            const mockAppConfig = {isProduction: true};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});

            assert.equal(baseClientRoute.generateBundleFilePath(testBundleName, mockAppConfig), `${testBundleName}.min.js`);
        });
    });
});
