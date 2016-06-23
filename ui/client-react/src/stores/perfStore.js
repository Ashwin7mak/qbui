import * as actions from "../constants/actions";
import PerfLogUtils from "../utils/perf/perfLogUtils";
import ReactPerfUtils from "../utils/perf/reactPerfUtils";
import Configuration from "../config/app.config.js";
import _ from "lodash";
import Fluxxor from "fluxxor";
import Logger from "../utils/logger";
import WindowLocationUtils from '../utils/windowLocationUtils';
var logger = new Logger();

/**
In addition to splunk timing measurements captured Devs can use :
    - in debug console: EPISODES.drawEpisodes($('.mainContent')) to see timeline
    - add ?perfTables to pages url to see page load stats via ReactPerf utility
**/


let PerfStore = Fluxxor.createStore({

    initialize() {
        this.bindActions(
            actions.LOAD_APPS,             () => {this.onLoadStart(actions.LOAD_APPS);},
            actions.LOAD_APPS_SUCCESS,     () => {this.onLoadEnd(actions.LOAD_APPS);},
            actions.LOAD_APPS_FAILED,      () => {this.onLoadEnd(actions.LOAD_APPS);},
            actions.LOAD_REPORTS,          () => {this.onLoadStart(actions.LOAD_REPORTS);},
            actions.LOAD_REPORTS_SUCCESS,  () => {this.onLoadEnd(actions.LOAD_REPORTS);},
            actions.LOAD_REPORTS_FAILED,   () => {this.onLoadEnd(actions.LOAD_REPORTS);},
            actions.LOAD_REPORT,           () => {this.onLoadStart(actions.LOAD_REPORT);},
            actions.LOAD_REPORT_SUCCESS,   () => {this.onLoadEnd(actions.LOAD_REPORT);},
            actions.LOAD_REPORT_FAILED,    () => {this.onLoadEnd(actions.LOAD_REPORT);},
            actions.LOAD_FIELDS,           () => {this.onLoadStart(actions.LOAD_FIELDS);},
            actions.LOAD_FIELDS_SUCCESS,   () => {this.onLoadEnd(actions.LOAD_FIELDS);},
            actions.LOAD_FIELDS_FAILED,    () => {this.onLoadEnd(actions.LOAD_FIELDS);},
            actions.LOAD_RECORDS,          () => {this.onLoadStart(actions.LOAD_RECORDS);},
            actions.LOAD_RECORDS_SUCCESS,  () => {this.onLoadEnd(actions.LOAD_RECORDS);},
            actions.LOAD_RECORDS_FAILED,   () => {this.onLoadEnd(actions.LOAD_RECORDS);},

            actions.MARK_PERF, this.onMark,
            actions.MEASURE_PERF, this.onMeasure,
            actions.LOG_MEASUREMENTS_PERF, this.onLogMeasurements,
            actions.DONE_ROUTE_PERF, this.onDone,
            actions.NEW_ROUTE_PERF, this.onNewRoute

        );
        this.ReactPerf = null;
        this.initInitalStats =  _.once(this.initDevConsoleStats);
        this.logInitalStats =  _.once(this.devConsoleStats);
        this.logger = new Logger();
    },
    onMark(payload) {
        PerfLogUtils.mark(payload);
    },
    onMeasure(payload) {
        PerfLogUtils.measure(payload.label, payload.start, payload.end);
    },
    onLogMeasurements(payload) {
        PerfLogUtils.send(payload);
    },
    devConsoleStats() {
        if (WindowLocationUtils.searchIncludes('perfTables')) {
            //browser console the performance measurements
            ReactPerfUtils.devPerfPrint(Configuration, this.ReactPerf);
        }
    },
    initDevConsoleStats() {
        if (WindowLocationUtils.searchIncludes('perfTables')) {
            //init the perf measurements for development environment
            this.ReactPerf = ReactPerfUtils.devPerfInit(Configuration, window);
        }
    },

    onDone(payload) {
        PerfLogUtils.done(payload);
        this.logInitalStats();
    },
    onNewRoute(payload) {
        this.initInitalStats();
        PerfLogUtils.mark(payload);

    },
    onLoadStart(type) {
        this.onMark("loading-" + type);
    },
    onLoadEnd(type) {
        this.onMeasure({label:type, start:"loading-" + type});
        // apps page is done when apps are loaded
        if (type === actions.LOAD_APPS) {
            this.onDone();
        }
    },

    getState() {
        return {
        };
    },
});

export default PerfStore;
