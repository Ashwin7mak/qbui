const reactViews = require('express-react-views');
const log = require('../logger').getLogger();
const path = require('path');
let baseRoute = require('../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;

const engineOptions = {
    beautify: true,
};
const jsxEngine = reactViews.createEngine(engineOptions);

function renderJsx(req, res, filename, opts) {
    const templatePath = require.resolve(filename);
    jsxEngine(templatePath, opts, (err, str) => {
        if (!err) {
            res.write(str);
            res.end();
        } else {
            log.error({req:req}, 'ERROR rendering jsx file:' + filename + '; MESSAGE: ' + err.message);
            res.write('Error rendering page');
            res.end();
        }
    });
}

/**
 * Use options to pass in parameters based on the route
 */
function renderIndex(req, res, options) {
    renderJsx(req, res, path.join(__dirname, '/viewComponents/index.jsx'), options);
}

class BaseClientRoute {
    constructor(app, appConfig, baseProps) {
        this.app = app;
        this.appConfig = appConfig;
        this.baseProps = baseProps;
    }

    addRoutesFromArrayOfPaths(paths = [], options) {
        paths.forEach(currentPath => {
            this.addRoute(currentPath, options);
        });
    }

    addRoute(currentPath, options = {}) {
        this.app.route(`${baseRoute}${currentPath.length === 0 || currentPath.charAt(0) === '/' ? currentPath : `/${currentPath}`}`).get((req, res) => {
            renderIndex(req, res, Object.assign({}, this.baseProps, {title: 'QuickBase', req: req}, options));
        });
    }

    /**
     * Generates the correct bundle file path based on the current environment
     * @param bundleFileName - bundleFileName without the extension
     * @returns {string}
     */
    generateBundleFilePath(bundleFileName) {
        return (this.appConfig.isProduction ? `${bundleFileName}.min.js` : `${bundleFileName}.js`);
    }
}

module.exports = BaseClientRoute;
