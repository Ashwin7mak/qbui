##Logging

Node logging is done via Bunyan.  The logger configuration is determined by the settings in the configuration file per run-time environment. 
Here's an example local.js configuration:

        //  Logging configuration
        LOG: {
            name: 'qbse-local',
            level: 'debug',
            stream: {
                type: 'console',
                file: {
                    dir: './logs',
                    name: 'qbse-local-' + dateUtils.formatDate( new Date(), '%Y-%M-%D-%h.%m.%s') + '.log',
                    rotating: {
                        period: '1d',
                        count: 7
                    }
                }
            },
            src: true,               // this is slow...do not use in prod
        },

Configuration info:

        name: name of the logger
        level: log level
        stream.type: output to 'console' or 'file'.  If stream type is file:
                file.dir: directory where log file is located
                file.name: name of the output file.
                if outputting to a file, can also setup to rotate the files per schedule.
                    rotating.period: how often to rotate the file
                    rotating.count: max number of rotated files to keep
        src:  true or false  --> 

Reference Links

1. For information on Bunyan configuration settings, click [here](https://github.com/trentm/node-bunyan)
2. For information around issue with rotating file logging in multi-clustered node environments: click [here](https://github.com/trentm/node-bunyan#stream-type-rotating-file)
3. For an overview of the logging design regarding transactionId(TID) and clientId(CID), click [here](https://wiki.intuit.com/display/qbasepd/Client+Logging) 
 
