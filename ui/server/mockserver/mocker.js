/* istanbul ignore next */
(function() {
    var fs = require('fs');
    var path = require('path');
    var yargs = require('yargs');
    var jsonServer = require('json-server');

// Parse arguments
    var argv = yargs
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

    var port = process.env.PORT || argv.port;
    var infile = argv.file;
// use the db.json file copy from sample if it doesn't exist
    var dbfile;
    if (infile && fs.existsSync(infile)) {
        dbfile = infile;
    } else {
        dbfile = path.join(__dirname, 'db.json');
    }
    var dbSamplefile = path.join(__dirname, 'db.json.sample');
    if (!fs.existsSync(dbfile) && fs.existsSync(dbSamplefile)) {
        //copy sample file
        console.log("Copying db.json.sample to db.json...");
        var contents = fs.readFileSync(dbSamplefile, 'utf8');
        fs.writeFileSync(dbfile, contents);
    }

// Returns an Express server
    var server = jsonServer.create();

    server.use(function(req, res, next) {
        delete req.query.query;
        delete req.query.format;
        next();
    });

// Set default middlewares (logger, static, cors and no-cache)
    server.use(jsonServer.defaults());

// Custom routes
    server.get('/api/api/v1/ticket', function(req, res) {
        res.send('8_bkbn766qp_j2s_duii_a_9s59gbbvatm7dbqvp5incc7pp4sbeaj99sb7eaua5da7djzwmmzsdv');
    });
//Add any additional custom or generated route responses here

// Returns an Express router
    var router = jsonServer.router(dbfile);

//post process response special treatment
//     router.render = function(req, res) {
//         if (res.locals.data.code) {
//             // treat code in db files as error
//             res.status(500).jsonp({
//                 error: res.locals.data.message,
//                 code: res.locals.data.code,
//             });
//         } else {
//             res.jsonp(res.locals.data);
//         }
//     };

    server.use(router);

    server.listen(port, argv.host);
    console.log("Mock backend listening on port " + port + " - http://" + argv.host + ":" + port +  "  \ndbfile : "+ dbfile);
}());

