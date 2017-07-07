/**
 * Static class of window performance functions
 *   extracted for mockability /testability
 */
const WindowPerformanceUtils = {

    /**
     * Returns the time from page start to now
     * @returns {*} Number
     */
    now() {
        return window.performance.now();
    },

    /**
     * If the performance.mark function exists (doesn't in safari), calls the mark
     * function with the given name to mark the time passed from page load to now (millis)
     * @param name - String
     * @returns {boolean} - true if performance.mark exists and marked, false if not supported
     */
    markTime(name) {
        if (window.performance.mark) {
            window.performance.mark(name);
            return true;
        }
        return false;
    },

    /**
     * Records the time difference (millis) between the last performance mark of startName to the last of endName,
     * storing it as an entry under the measureName
     * @param measureName - String - desired name of this measurement
     * @param startName - String - the starting time for the measurement
     * @param endName - String - the ending time for the measurement
     */
    measureTimeDiff(measureName, startName, endName) {
        window.performance.measure(measureName, startName, endName);
    },

    /**
     * Returns all performance entries under the given name
     * @param name - String
     * @returns Array of Objects - array containing all entries
     */
    getEntriesByName(name) {
        return window.performance.getEntriesByName(name);
    },

    /**
     * Gets the latest entry of the performance entries under the given name
     * @param name - String
     * @returns {*}
     */
    getLastEntryByName(name) {
        let entries = this.getEntriesByName(name);
        return entries.length ? entries[entries.length - 1] : null;
    },

    /**
     * Gets the duration of the last entry contained in the list of performance entries
     * @param name - String
     * @returns null if no entry exists for the given name, Number otherwise
     */
    getDurationFromLastEntry(name) {
        let entry = this.getLastEntryByName(name);
        return entry ? entry.duration : null;
    }
}

export default WindowPerformanceUtils;

