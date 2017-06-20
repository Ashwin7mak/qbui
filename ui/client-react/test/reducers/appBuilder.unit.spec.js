import reducer from '../../src/reducers/appBuilder';
import * as AppBuilderSelectors from '../../src/reducers/appBuilder';
import * as types from '../../src/actions/types';
import _ from 'lodash';
let storeState = {};

let mockState = {appBuilder: {dialogOpen: true}};

describe('Test appBuilder reducer - initial state', () => {
    it('return default state', () => {
        expect(reducer(undefined, {})).toEqual(storeState);
    });
});

describe('App Creation', () => {
    it('will show the app creation dialog', () => {
        const state = reducer(storeState, {type: types.SHOW_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(true);
    });

    it('will hide the app creation dialog', () => {
        const state = reducer(storeState, {type: types.HIDE_APP_CREATION_DIALOG});

        expect(state.dialogOpen).toBe(false);
    });

    describe('App Creation Selector', () => {
        it('will return true for dialogOpen state if it is true', () => {
            let openDialog = AppBuilderSelectors.getIsDialogOpenState(mockState);

            expect(openDialog).toEqual(true);
        });

        it('will return false for dialogOpen if there is no dialogOpen state', () => {
            let openDialog = AppBuilderSelectors.getIsDialogOpenState({});

            expect(openDialog).toEqual(false);
        });

        it('will return false for dialogOpen if the dialogOpen state is false', () => {
            let mockCloneState = _.cloneDeep(mockState);
            mockCloneState.appBuilder.dialogOpen = false;
            let openDialog = AppBuilderSelectors.getIsDialogOpenState(mockCloneState);

            expect(openDialog).toEqual(false);
        });
    });
});
