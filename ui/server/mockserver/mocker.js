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
        })
        .example('$0 -p9090', '')
        .argv;

    var port = process.env.PORT || argv.port;

// Returns an Express server
    var server = jsonServer.create();

// Set default middlewares (logger, static, cors and no-cache)
    server.use(jsonServer.defaults());

// Custom routes
    server.get('/api/api/v1/ticket', function(req, res) {
        res.send('8_bkbn766qp_j2s_duii_a_9s59gbbvatm7dbqvp5incc7pp4sbeaj99sb7eaua5da7djzwmmzsdv');
    });
//Add any additional custom or generated route responses here

// Returns an Express router
    var dbfile = path.join(__dirname, 'db.json');
    var router = jsonServer.router(dbfile);
    server.use(router);

    server.listen(port, argv.host);
    console.log("Mock backend listening on port " + port + " - http://" + argv.host + ":" + port);
}());

