
import * as breakpoints from '../constants/breakpoints';

class Breakpoints  {

    static getCurrentBreakpointClass() {
        let w = window.innerWidth;

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
}

export default Breakpoints;
