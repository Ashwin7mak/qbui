import commonNavActions, {toggleNav, TOGGLE_NAV} from '../../src/components/sideNavs/commonNavActions';

describe('CommonNavActions', () => {
    it('sends an event to update the nav state', () => {
        expect(toggleNav()).toEqual({type: TOGGLE_NAV});
    });

    it('sends an event to update the nav state that is scoped to the passed in functional area', () => {
        const testFunctionalArea = 'test';

        const actions = commonNavActions(testFunctionalArea);

        expect(actions.toggleNav()).toEqual({type: `${TOGGLE_NAV}_${testFunctionalArea}`});
    });
});
