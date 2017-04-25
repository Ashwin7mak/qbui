/* istanbul ignore next */
(() => {
    'use strict';

    let fs = require('fs');
    let path = require('path');
    let yargs = require('yargs');
    let jsonServer = require('json-server');

    // Parse arguments
    let argv = yargs
        .usage('$0 [options] ')
        .help('help').alias('help', 'h')
        .options({
            port: {
                alias: 'p',
                description: 'Set port',
                default: 3030
            },
            host: {
                alias: 'H',
                description: 'Set host',
                default: '0.0.0.0'
            },
            file: {
                alias: 'f',
                description: 'Set db file (must be within mockserver directory)',
                default: 'db.json'
            },
        })
        .example('$0 -p9090', '')
        .argv;

    let port = process.env.PORT || argv.port;
    let infile = argv.file;
    // use the db.json file copy from sample if it doesn't exist
    let dbfile;
    if (infile) {
        infile = path.join(__dirname, infile);
    }
    if (infile && fs.existsSync(infile)) {
        dbfile = infile;
    } else {
        dbfile = path.join(__dirname, 'db.json');
    }

    let routes = require(dbfile);

    // Returns an Express server
    let server = jsonServer.create();

    server.use((req, res, next) => {
        delete req.query.query;
        delete req.query.format;
        next();
    });

    // Custom routes
    server.get('/api/api/v1/ticket', (req, res) => {
        res.send('8_bkbn766qp_j2s_duii_a_9s59gbbvatm7dbqvp5incc7pp4sbeaj99sb7eaua5da7djzwmmzsdv');
    });

    server.post('api/n/v1/log', function(req, res) {
        res.send('foobar');
    });
    //Add any additional custom or generated route responses here

    let genericRouter = function(req, res) {
        var contents = routes[req.path];
        if (!contents) {
            contents = routes[req.path.substr(1)];
        }

        if (contents) {
            res.json(contents);
        } else {
            res.status(404).send('Not found');
        }
    };

    server.get('/*', genericRouter);
    // Returns an Express router
    server.listen(port, argv.host);
    console.log("Mock backend listening on port " + port + " - http://" + argv.host + ":" + port + "  \ndbfile : " + dbfile);

})();
