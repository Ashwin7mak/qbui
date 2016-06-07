(function() {
    'use strict';

    var sauceConnectLauncher = require('sauce-connect-launcher');

    sauceConnectLauncher({
        username: 'QuickBaseNS',
        accessKey: 'f814e1b3-ac25-4369-af02-90d61c6b1c04',
        tunnelIdentifier: 'localTunnel',
        proxy: 'http://egressproxy.quickbaserocks.com:80',
        proxyTunnel: true,
        noProxyCaching: true,
        noAutodetect: true,
        //dns             : '127.0.0.1',
        verbose: true
        //version: true
        //doctor: true,
    }, function (err, sauceConnectProcess) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log("Sauce Connect ready");
    });
});