// action creators
import * as actions from "../constants/actions";

let perfActions = {

    /**
     * mark the start of something happening
     *
     * @param start - the string name you want to tag it with
     */
    mark(start) {
        this.dispatch(actions.MARK_PERF, start);
    },
    /**
     * measures the time it took for some happening and adds it it to the
     * set of measurements so far
     *
     * @param label - the string name you want to tag it with
     * @param start - the time or name used in a mark call for the start
     * @param end - optional the time or name used in a mark call for the end
     */
    measure(label, start, end) {
        this.dispatch(actions.MEASURE_PERF, {label:label, start: start, end:end});
    },
    /**
     * marks the start of a new route (ajax)
     * resets the measurements
     * @param routeName - the string name you want to tag it with
     */
    newRoute(routeName) {
        this.dispatch(actions.NEW_ROUTE_PERF, routeName);
    },
    /**
     *  marks the end of a route (new route /or fullpage load)
     * @param payload - optional object with any addition info to output with the measurements
     */
    doneRoute(payload) {
        this.dispatch(actions.DONE_ROUTE_PERF, payload);
    },
    /**
     * write out the current measurements to the log
     * @param payload - optional object with any addition info to output with the measurements
     */
    logMeasurements(payload) {
        this.dispatch(actions.LOG_MEASUREMENTS_PERF, payload);
    }

};

export default perfActions;
