import * as AppBuilderActions from '../../src/actions/appBuilderActions';
import * as types from '../../src/actions/types';

describe('App Actions success workflow functions', () => {
    it('create showAppCreationDialog event', () => {
        expect(AppBuilderActions.showAppCreationDialog()).toEqual(event(types.SHOW_APP_CREATION_DIALOG));
    });
});
