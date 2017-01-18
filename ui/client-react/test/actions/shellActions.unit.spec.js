import * as shellActions from '../../src/actions/shellActions';
import * as types from '../../src/actions/types';

let smallBreakpoint = false;
class BreakpointsMock {
    static isSmallBreakpoint() {
        return smallBreakpoint;
    }
}

beforeEach(() => {
    smallBreakpoint = false;
});

describe('Shell actions', () => {

    it('should create an action to show trowser', () => {
        const content = "reportBrowser";
        expect(shellActions.showTrowser(content)).toEqual({type: types.SHOW_TROWSER, content});
    });

    it('should create an action to hide trowser', () => {
        expect(shellActions.hideTrowser()).toEqual({type: types.HIDE_TROWSER});
    });

    it('create an action to toggle left nav for small breakpoint', () => {
        smallBreakpoint = true;
        shellActions.__Rewire__('Breakpoints', BreakpointsMock);

        const navState = true;
        expect(shellActions.toggleLeftNav(navState)).toEqual({type: types.TOGGLE_LEFT_NAV_VISIBLE, navState});
        shellActions.__ResetDependency__('Breakpoints');
    });

    it('create an action to toggle left nav for non-small breakpoint', () => {
        shellActions.__Rewire__('Breakpoints', BreakpointsMock);

        const navState = true;
        expect(shellActions.toggleLeftNav(navState)).toEqual({type: types.TOGGLE_LEFT_NAV_EXPANDED, navState});
        shellActions.__ResetDependency__('Breakpoints');
    });
});
