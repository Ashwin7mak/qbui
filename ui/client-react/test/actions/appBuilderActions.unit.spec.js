import * as AppBuilderActions from '../../src/actions/appBuilderActions';
import * as types from '../../src/actions/types';

describe('App Actions success workflow functions', () => {
    it('create showAppCreationDialog event', () => {
        expect(AppBuilderActions.showAppCreationDialog()).toEqual({type: types.SHOW_APP_CREATION_DIALOG});
    });

    it('create hideAppCreationDialog event', () => {
        expect(AppBuilderActions.hideAppCreationDialog()).toEqual({type: types.HIDE_APP_CREATION_DIALOG});
    });
});
