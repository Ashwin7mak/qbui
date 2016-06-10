/**
 * Static class of React Component Performance Utility functions
 * FOR DEV only not PROD
 */
import Logger from '../../utils/logger';
let logger = new Logger();

class ReactPerfUtils {


    /**
     * devPerfInit starts the React client side perf reporting
     * NOTE: this is only available development **NOT in production**
     * @see https://facebook.github.io/react/docs/perf.html
     * @param configuration
     * @param global if supplied will set global.Perf to the reactPerf object
     * @returns  the reactPerf object you can call stop and print methods on
     */
   static devPerfInit(configuration, global) {
       let reactPerf;
       if (configuration && configuration.env !== 'PROD' &&
           nodeConfig &&  nodeConfig.isPerfTrackingEnabled) {
           reactPerf = ReactPerfUtils.requireReactDefaultPerf();
           if (global) {
               global.Perf = reactPerf;
           }
           reactPerf.start();
       }
       return reactPerf;
   }

    /**
     * devPerfPrint stops measuring and prints out the captured react component measurements
     * @param configuration
     * @param reactPerf
     */
    static devPerfPrint(configuration, reactPerf) {
        if (configuration && configuration.env !== 'PROD' &&
            reactPerf && nodeConfig && nodeConfig.isPerfTrackingEnabled) {
            reactPerf.stop();
            var measurements = reactPerf.getLastMeasurements();
            // this info is only available in non-production dev mode
            logger.logToServer = false;
            logger.logToConsole = true;

            //Prints the overall time taken.
            logger.debug('\n\nInclusive measurements table');
            reactPerf.printInclusive(measurements);

            //"Exclusive" times don't include the times taken to mount the components: processing props,
            // getInitialState, call componentWillMount and componentDidMount etc.
            logger.debug('\n\nExclusive measurements table');
            reactPerf.printExclusive(measurements);

            //"Wasted" time is spent on components that didn't actually render anything,
            // e.g. the render stayed the same, so the DOM wasn't touched.
            logger.debug('\n\nWasted time on render');
            reactPerf.printWasted(measurements);

            //reactPerf.printDOM is not as useful and is a lot of data generation

        }
    }

    /**
     * this module is loaded only in nonproduction
     * use getter to enable testability
     * @returns {any|*}
     */
    static requireReactDefaultPerf() {
        return require('react/lib/ReactDefaultPerf');
    }
}
export default ReactPerfUtils;

