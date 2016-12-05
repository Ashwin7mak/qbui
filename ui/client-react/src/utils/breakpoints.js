/**
 * breakpoint utils
 */

const SMALL_BREAKPOINT = 640;
const MEDIUM_BREAKPOINT = 1024;

class Breakpoints {

    static isSmallBreakpoint() {
        return Breakpoints.smallMQ.matches;
    }

    static isSmallOrMediumBreakpoint() {
        return (Breakpoints.smallMQ.matches || Breakpoints.mediumMQ.matches);
    }
}
Breakpoints.smallMQ = window.matchMedia(`(max-width: ${SMALL_BREAKPOINT}px)`);
Breakpoints.mediumMQ = window.matchMedia(`(min-width: ${SMALL_BREAKPOINT + 1}px) and (max-width: ${MEDIUM_BREAKPOINT}px)`);

export default Breakpoints;
