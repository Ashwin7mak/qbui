const reactViews = require('express-react-views');
const log = require('../logger').getLogger();
const path = require('path');
const fs = require('fs');
let baseRoute = require('../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;

const engineOptions = {
    beautify: true
};
const jsxEngine = reactViews.createEngine(engineOptions);

class BaseClientRoute {
    constructor(app, appConfig, baseProps) {
        this.app = app;
        this.appConfig = appConfig;
        this.baseProps = baseProps;
    }

    /**
     * A helper method to add an array of paths with similar options.
     * @param paths - an array of paths (that do not include the base route applied to all paths)
     * @param options - optional. Override the title or bundle file for all paths in the array.
     */
    addRoutesFromArrayOfPaths(paths = [], options) {
        paths.forEach(currentPath => {
            this.addRoute(currentPath, options);
        });
    }

    /**
     * Adds a route to the express app
     * @param currentPath - the path for the new route. It should not include the base route that is part of all routes.
     * @param options - optional. Override the title or bundle file for a route.
     */
    addRoute(currentPath, options = {}) {
        this.app.route(`${baseRoute}${currentPath.length === 0 || currentPath.charAt(0) === '/' ? currentPath : `/${currentPath}`}`).get((req, res) => {
            this.renderJsx(req, res, path.join(__dirname, '/viewComponents/index.jsx'), options);
        });
    }

    /**
     * Generates the path to the correct bundle file when using cahe-busting or chunkfiles in webpack.
     * It only returns a value when the environment is set to production as other environments do not use cache-busting/chunkfiles.
     * @param bundleFileName
     * @returns {*}
     */
    generateWebpackBundleFilePath(bundleFileName) {
        const manifestPath = path.join(__dirname, '../manifest/manifest.json');
        if (this.appConfig.isProduction && fs.existsSync(manifestPath)) {
            const webpackManifest = require(manifestPath);
            return webpackManifest[`${bundleFileName}.js`];
        }

        return false;
    }

    /**
     * Generates the correct bundle file path based on the current environment.
     * @param bundleFileName - bundleFileName without the extension
     * @returns {string}
     */
    generateBundleFilePath(bundleFileName) {
        const webpackFilePath = this.generateWebpackBundleFilePath(bundleFileName);

        if (webpackFilePath) {
            return webpackFilePath;
        }

        // Use this as a fallback in case webpack manifest has not been generated or operating in a non-prod environment.
        return (this.appConfig.isProduction ? `${bundleFileName}.min.js` : `${bundleFileName}.js`);
    }

    /**
     * Render a jsx file with the passed in options
     * @param req
     * @param res
     * @param filename
     * @param options
     */
    renderJsx(req, res, filename, options) {
        const templatePath = require.resolve(filename);
        jsxEngine(templatePath, Object.assign({}, this.baseProps, {title: 'QuickBase', req: req}, options), (err, str) => {
            if (!err) {
                res.write(str);
                res.end();
            } else {
                log.error({req: req}, 'ERROR rendering jsx file:' + filename + '; MESSAGE: ' + err.message);
                res.write('Error rendering page');
                res.end();
            }
        });
    }
}

module.exports = BaseClientRoute;
