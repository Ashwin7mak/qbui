const rewire = require("rewire");
const BaseClientRoute = rewire('../../src/routes/baseClientRoute');
const baseClientPath = require('../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;
const sinon = require('sinon');
const assert = require('assert');

const mockExpressApp = {route(_path) {return {get(_callback) {}};}};

let baseClientRoute;

describe('BaseClientRoute', () => {
    const testBundleName = 'bundle';
    const testWebpackFile = 'someFile.1234.min.js';

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

    describe('generateWebpackBundleFilePath', () => {
        let revertFsMock;
        let revertPathMock;

        const mockFs = {
            existsSync(_filePath) {}
        };

        const mockPath = {
            join(_path1, _path2) {}
        };

        beforeEach(() => {
            revertFsMock = BaseClientRoute.__set__('fs', mockFs);
            revertPathMock = BaseClientRoute.__set__('path', mockPath);
        });

        afterEach(() => {
            revertFsMock();
            revertPathMock();
        });

        it('returns false if there is no webpack manifest file', () => {
            const mockAppConfig = {isProduction: true};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});
            let mockFsStub = sinon.stub(mockFs, 'existsSync', () => false);

            assert.equal(baseClientRoute.generateWebpackBundleFilePath(testBundleName), false);

            mockFsStub.restore();
        });

        it('returns false if not in a production environment', () => {
            const mockAppConfig = {isProduction: false};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});

            assert.equal(baseClientRoute.generateWebpackBundleFilePath(testBundleName), false);
        });

        it('returns the file listed in the webpack manifest if in production and the manifest file exists', () => {
            const mockAppConfig = {isProduction: true};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});
            let mockFsStub = sinon.stub(mockFs, 'existsSync', () => true);
            let mockPathStub = sinon.stub(mockPath, 'join', () => '../../test/testHelpers/mockManifest.json');

            assert.equal(baseClientRoute.generateWebpackBundleFilePath(testBundleName), testWebpackFile);

            mockFsStub.restore();
            mockPathStub.restore();
        });
    });

    describe('generateBundleFilePath', () => {
        it('returns the correct name for non-production environments', () => {
            const mockAppConfig = {isProduction: false};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});

            assert.equal(baseClientRoute.generateBundleFilePath(testBundleName), `${testBundleName}.js`);
        });

        it('returns the correct name for the production environment', () => {
            const mockAppConfig = {isProduction: true};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});

            assert.equal(baseClientRoute.generateBundleFilePath(testBundleName), `${testBundleName}.js`);
        });

        it('returns the correct name when in production environment and there is a webpack manifest file', () => {
            const mockAppConfig = {isProduction: true};
            baseClientRoute = new BaseClientRoute(mockExpressApp, mockAppConfig, {});

            sinon.stub(baseClientRoute, 'generateWebpackBundleFilePath', () => testWebpackFile);

            assert.equal(baseClientRoute.generateBundleFilePath(testBundleName), testWebpackFile);

            sinon.restore();
        });
    });
});
