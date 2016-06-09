/**
 * Static class of React Component Performance Utility functions
 * FOR DEV only not PROD
 */

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

            //Prints the overall time taken.
            reactPerf.printInclusive(measurements);

            //"Exclusive" times don't include the times taken to mount the components: processing props,
            // getInitialState, call componentWillMount and componentDidMount etc.
            reactPerf.printExclusive(measurements);

            //"Wasted" time is spent on components that didn't actually render anything,
            // e.g. the render stayed the same, so the DOM wasn't touched.
            reactPerf.printWasted(measurements);

            reactPerf.printDOM(measurements);
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

