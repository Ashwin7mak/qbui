import * as shellActions from '../../src/actions/shellActions';
import {__RewireAPI__ as shellActionsRewireAPI} from '../../src/actions/shellActions';
import * as types from '../../src/actions/types';

let smallBreakpoint = false;
class BreakpointsMock {
    static isSmallBreakpoint() {
        return smallBreakpoint;
    }
}

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
        shellActionsRewireAPI.__Rewire__('Breakpoints', BreakpointsMock);

        const navState = true;
        expect(shellActions.toggleLeftNav(navState)).toEqual({type: types.TOGGLE_LEFT_NAV_VISIBLE, navState});
        shellActionsRewireAPI.__ResetDependency__('Breakpoints');
    });

    it('create an action to toggle left nav for non-small breakpoint', () => {
        smallBreakpoint = false;
        shellActionsRewireAPI.__Rewire__('Breakpoints', BreakpointsMock);

        const navState = true;
        expect(shellActions.toggleLeftNav(navState)).toEqual({type: types.TOGGLE_LEFT_NAV_EXPANDED, navState});
    });

    it('should create an action to show row actions menu', () => {
        const toggleState = true;
        expect(shellActions.toggleRowActionsMenu(toggleState)).toEqual({type: types.TOGGLE_ROW_POP_UP_MENU, toggleState});
    });

    it('should create an action to toggle apps list', () => {
        const toggleState = true;
        expect(shellActions.toggleAppsList(toggleState)).toEqual({type: types.TOGGLE_APPS_LIST, toggleState});
    });
    it('should create an action to hide error dialog', () => {
        expect(shellActions.hideErrorMsgDialog()).toEqual({type: types.HIDE_ERROR_MSG_DIALOG});
    });
    it('should create an action to show error dialog', () => {
        expect(shellActions.showErrorMsgDialog()).toEqual({type: types.SHOW_ERROR_MSG_DIALOG});
    });
});
