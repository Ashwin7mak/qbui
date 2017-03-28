import {toggleNav, TOGGLE_NAV} from '../../src/components/sideNavs/commonNavActions';

describe('CommonNavActions', () => {
    it('sends an event to update the nav state', () => {
        expect(toggleNav()).toEqual({type: TOGGLE_NAV});
    });
});