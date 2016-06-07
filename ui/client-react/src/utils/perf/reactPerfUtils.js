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
     * @param global
     * @returns  the reactPerf object you can call stop and print methods on
     */
   static devPerfInit(configuration, global) {
        let reactPerf;
        if (configuration.env !== 'PROD' && _.has(configuration, this.consoleLogReactPerf) && configuration.consoleLogReactPerf) {
            global.Perf = reactPerf = require('react/lib/ReactDefaultPerf');
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
        if (configuration.env !== 'PROD' && _.has(configuration, this.consoleLogReactPerf) && configuration.consoleLogReactPerf) {
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

}
ReactPerfUtils.consoleLogReactPerf = "consoleLogReactPerf";
export default ReactPerfUtils;

