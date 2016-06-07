/**
 * Static class of Client Performance Logging Utility functions
 */
import _ from 'lodash';

class PerfLogUtils {

    /**
     * @return true if we are tracking client side performance
     */
    static isEnabled() {
        return (typeof(EPISODES) !== 'undefined')
    }


    /**
     *  Mark timing of a happening.
     * @param note  - the name to call the happening
     * @param noteTime - the optional time to used,  now if not specified
     */
    static mark(note, noteTime) {
        if (PerfLogUtils.isEnabled()) {
            EPISODES.mark(note, noteTime);
        }
    }

    /**
     *  Measure timing of a happening.
     * @param note  - the name to call the happening
     * @param startTime - the name of the start happening or a time
     * @param endTime - the optional end time to use; now if not specified
     */
    static measure(note, startTime, endTime) {
        if (PerfLogUtils.isEnabled()) {
            EPISODES.measure(note, startTime, endTime);
        }
    }

    /**
     * Send the beacon the performance stats to log it on the backend
     * @param params - any additional info to send along
     */
    static send(params) {
        if (PerfLogUtils.isEnabled()) {
            EPISODES.sendBeacon(EPISODES.beaconUrl, _.extend({}, userInfo, params));
        }
    }

    /**
     * call "done()" to signal the end of episodes.
     * @param cb optional callback
     */
    static done(cb) {
        if (PerfLogUtils.isEnabled()) {
            EPISODES.done(cb);
            PerfLogUtils.isDone = true;
        }
    }


    /**
     * call "isDone()" to find out if its done measuring.
     * @return bool
     */
    static isDone() {
        if (PerfLogUtils.isEnabled()) {
            return PerfLogUtils.isDone;
        }
        return null;
    }


    /**
     * call "setNotDone" to set to undone measuring.
     * @return bool
     */
    static setNotDone() {
        if (PerfLogUtils.isEnabled()) {
            EPISODES.bDone = false;
            PerfLogUtils.isDone = false;
        }
    }


}
PerfLogUtils.isDone = false;
export default PerfLogUtils;

