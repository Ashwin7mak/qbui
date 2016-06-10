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
                description: 'Set db file',
                default: 'db.json'
            },
        })
        .example('$0 -p9090', '')
        .argv;

    let port = process.env.PORT || argv.port;
    let infile = argv.file;
    // use the db.json file copy from sample if it doesn't exist
    let dbfile;
    if (infile && fs.existsSync(infile)) {
        dbfile = infile;
    } else {
        dbfile = path.join(__dirname, 'db.json');
    }
    let dbSamplefile = path.join(__dirname, 'db.json.sample');
    if (!fs.existsSync(dbfile) && fs.existsSync(dbSamplefile)) {
        //copy sample file
        console.log("Copying db.json.sample to db.json...");
        let contents = fs.readFileSync(dbSamplefile, 'utf8');
        fs.writeFileSync(dbfile, contents);
    }

    // Returns an Express server
    let server = jsonServer.create();

    server.use((req, res, next) => {
        delete req.query.query;
        delete req.query.format;
        next();
    });

    // Set default middlewares (logger, static, cors and no-cache)
    server.use(jsonServer.defaults());

    // Custom routes
    server.get('/api/api/v1/ticket', (req, res) => {
        res.send('8_bkbn766qp_j2s_duii_a_9s59gbbvatm7dbqvp5incc7pp4sbeaj99sb7eaua5da7djzwmmzsdv');
    });

    server.post('api/n/v1/log', function(req, res) {
        res.send('foobar');
    });
    //Add any additional custom or generated route responses here

    // Returns an Express router
    let router = jsonServer.router(dbfile);

    server.use(router);

    server.listen(port, argv.host);
    console.log("Mock backend listening on port " + port + " - http://" + argv.host + ":" + port + "  \ndbfile : " + dbfile);

})();
