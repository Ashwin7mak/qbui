import * as AppBuilderActions from '../../src/actions/appBuilderActions';
import * as types from '../../src/actions/types';

let appId = 'appId';
let tblId = 'tblId';

function event(type, content) {
    return {
        type: type,
        content: content || null
    };
}

describe('App Actions success workflow functions', () => {
    it('create showAppCreationDialog event', () => {
        expect(AppBuilderActions.showAppCreationDialog()).toEqual(event(types.SHOW_APP_CREATION_DIALOG));
    });
});
