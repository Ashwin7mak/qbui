import CommonNavReducer from '../../src/components/sideNavs/commonNavReducer';
import {TOGGLE_NAV} from '../../src/components/sideNavs/commonNavActions';

// IMPORTS FROM CLIENT REACT
import Breakpoints from '../../../../client-react/src/utils/breakpoints';
// IMPORTS FROM CLIENT REACT

let reducer;
let result;

describe('CommonNavReducer', () => {
    describe('on large breakpoint', () => {
        beforeEach(() => {
            spyOn(Breakpoints, 'isSmallBreakpoint').and.returnValue(false);

            reducer = CommonNavReducer();
        });

        it('returns the state if there is no matching action', () => {
            const testState = 'some state';
            result = reducer(testState);

            expect(result).toEqual(testState);
        });

        it('collapses the nav', () => {
            result = reducer({isNavCollapsed: false}, {type: TOGGLE_NAV});

            expect(result).toEqual({isNavCollapsed: true});
        });

        it('un-collapses the nav', () => {
            result = reducer({isNavCollapsed: true}, {type: TOGGLE_NAV});

            expect(result).toEqual({isNavCollapsed: false});
        });
    });

    describe('on small breakpoint', () => {
        beforeEach(() => {
            spyOn(Breakpoints, 'isSmallBreakpoint').and.returnValue(true);

            reducer = CommonNavReducer();
        });

        it('toggles the nav open', () => {
            result = reducer({isNavOpen: false, isNavCollapsed: false}, {type: TOGGLE_NAV});

            expect(result).toEqual({isNavOpen: true, isNavCollapsed: false});
        });

        it('toggles the nav closed', () => {
            result = reducer({isNavOpen: true, isNavCollapsed: false}, {type: TOGGLE_NAV});

            expect(result).toEqual({isNavOpen: false, isNavCollapsed: false});
        });

        it('resets the collapsed state', () => {
            result = reducer({isNavOpen: true, isNavCollapsed: true}, {type: TOGGLE_NAV});

            expect(result).toEqual({isNavOpen: false, isNavCollapsed: false});
        });
    });

    it('optionally namespaces the action types', () => {
        spyOn(Breakpoints, 'isSmallBreakpoint').and.returnValue(true);

        const testNamespace = 'testArea';
        reducer = CommonNavReducer(testNamespace);

        // The namespaced action matched, so the state is updated.
        result = reducer({isNavOpen: true, isNavCollapsed: false}, {type: `${TOGGLE_NAV}_${testNamespace}`});
        expect(result).toEqual({isNavOpen: false, isNavCollapsed: false});

        // The action does not match, so the state is unchanged.
        result = reducer({isNavOpen: true, isNavCollapsed: false}, {type: TOGGLE_NAV});
        expect(result).toEqual({isNavOpen: true, isNavCollapsed: false});
    });

});
