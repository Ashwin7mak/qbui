const reactViews = require('express-react-views');
const log = require('../../logger').getLogger();
let baseRoute = require('../../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;

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
    renderJsx(req, res, '../viewComponents/index.jsx', options);
}

class BaseClientRoute {
    static addRoutesFromArrayOfPaths(app, baseProps, paths = [], options) {
        paths.forEach(path => {
            new BaseClientRoute(app, baseProps, path, options);
        });
    }

    constructor(app, baseProps, path, options = {}) {
        app.route(`${baseRoute}${path.charAt(0) == '/' ? path : `/${path}`}`).get((req, res) => {
            renderIndex(req, res, Object.assign({}, baseProps, {title: 'QuickBase', req: req}, options));
        });
    }
}

module.exports = BaseClientRoute;
