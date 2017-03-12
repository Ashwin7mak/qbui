import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/record';
import * as types from '../../src/actions/types';

describe('Saving form functions', () => {
    it('returns correct state when saving form', () => {
        expect(reducer(initialState, {type: types.SAVE_FORM, id: 'edit'})).toDeepEqual([{
            id: 'edit',
            saving: true,
            errorStatus: null
        }]);
    });

    it('returns correct state when save error occurs', () => {
        let savingFormState = [{
            id: 'edit',
            saving: true,
            errorStatus: null
        }];

        expect(reducer(savingFormState, {type: types.SAVE_FORM_FAILED, id: "edit", error: "oops"})).toDeepEqual([{
            id: 'edit',
            saving: false,
            errorStatus: "oops"
        }]);
    });

    it('returns correct state when save succeeds', () => {
        let savingFormState = [{
            id: 'edit',
            saving: true,
            errorStatus: null
        }];

        expect(reducer(savingFormState, {type: types.SAVE_FORM_SUCCESS, id: "edit"})).toDeepEqual([{
            id: 'edit',
            saving: false,
            errorStatus:null
        }]);
    });
});