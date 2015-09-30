
import LogLevel from '../utils/logLevels';

/*
    Application configuration settings per run-time environment.
 */

// TODO: this is just an initial pass defining basic run time configuration settings..  Need to figure out how best to
// TODO: define the environment(prod, test, local, etc) and how to inject the appropriate configuration settings

var Configuration = {
    env: 'LOCAL',
    logger: {
        logLevel: LogLevel.DEBUG,
        logToConsole: true,
        logToServer: false
    },
    api: {
        version: 'v1'
    }

}

export default Configuration;