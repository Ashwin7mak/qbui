import * as AppBuilderActions from '../../src/actions/appBuilderActions';
import * as types from '../../src/actions/types';

describe('App Actions event functions', () => {
    it('createNewApp event', () => {
        expect(AppBuilderActions.createNewApp()).toEqual({type: types.CREATE_APP});
    });

    const newApp = {id: '1'};
    it('create createAppSuccess event', () => {
        expect(AppBuilderActions.createAppSuccess(newApp)).toEqual({type: types.CREATE_APP_SUCCESS, app:newApp});
    });

    it('create createAppFailed event', () => {
        expect(AppBuilderActions.createAppFailed()).toEqual({type: types.CREATE_APP_FAILED});
    });

    it('create showAppCreationDialog event', () => {
        expect(AppBuilderActions.showAppCreationDialog()).toEqual(types.SHOW_APP_CREATION_DIALOG);
    });
});
