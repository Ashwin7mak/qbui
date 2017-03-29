/**
 * breakpoint utils
 */
class Breakpoints {

    static isSmallBreakpoint() {
        return Breakpoints.smallMQ.matches;
    }

    static isMediumBreakpoint() {
        return Breakpoints.mediumMQ.matches;
    }

    static isLargeBreakpoint() {
        return Breakpoints.largeMQ.matches;
    }

    static isXLargeBreakpoint() {
        return Breakpoints.xLargeMQ.matches;
    }

    static isNotSmallBreakpoint() {
        return Breakpoints.notSmallMQ.matches;
    }
}

Breakpoints.smallMQ = window.matchMedia('(max-width: 640px)');
Breakpoints.mediumMQ = window.matchMedia('(min-width: 641px and max-width: 1024px)');
Breakpoints.largeMQ = window.matchMedia('(min-width: 1025px and max-width: 1440px)');
Breakpoints.xLargeMQ = window.matchMedia('(min-width: 1441px)');
Breakpoints.notSmallMQ = window.matchMedia('(min-width: 641px)');

export default Breakpoints;
