/**
 * breakpoint utils
 */
class Breakpoints {

    static isSmallBreakpoint() {
        return Breakpoints.smallMQ.matches;
    }
}
Breakpoints.smallMQ = window.matchMedia('(max-width: 640px)');

export default Breakpoints;
