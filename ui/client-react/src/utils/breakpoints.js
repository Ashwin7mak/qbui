
import * as breakpoints from '../constants/breakpoints';

class Breakpoints  {

    static getCurrentBreakpointClass() {
        let w = window.innerWidth;

        if (Breakpoints.isTouchDevice() && window.devicePixelRatio) {
            w = window.innerWidth / window.devicePixelRatio;
        }

        if (w <= 640) {
            return breakpoints.SMALL_BREAKPOINT;
        } else if (w <= 1024) {
            return breakpoints.MEDIUM_BREAKPOINT;
        } else if (w <= 1440) {
            return breakpoints.LARGE_BREAKPOINT;
        } else {
            return breakpoints.XLARGE_BREAKPOINT;
        }
    }

    static isTouchDevice() {

        return "ontouchstart" in window;
    }
}

export default Breakpoints;
