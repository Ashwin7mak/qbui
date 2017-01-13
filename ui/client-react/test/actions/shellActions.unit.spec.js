import * as shellActions from '../../src/actions/shellActions';
import * as types from '../../src/actions/types';

describe('Shell actions', () => {

    it('should create an action to show trowser', () => {

        const content = "reportBrowser";
        expect(shellActions.showTrowser(content)).toEqual({type: types.SHOW_TROWSER, content});
    });

    it('should create an action to hide trowser', () => {

        expect(shellActions.hideTrowser()).toEqual({type: types.HIDE_TROWSER});
    });
});
