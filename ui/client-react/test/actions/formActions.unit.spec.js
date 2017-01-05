import * as formActions from '../../src/actions/formActions';
import * as types from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Form Actions functions', () => {

    describe('loading actions', () => {
        it('should create an action to indicate loading view form', () => {

            expect(formActions.loadingForm("view")).toEqual({type: types.LOADING_FORM, container: "view"});
        });

        it('should create an action to indicate load view form error', () => {

            expect(formActions.loadFormError("view", "oops")).toEqual({
                type: types.LOAD_FORM_ERROR,
                container: "view",
                error: "oops"
            });
        });

        it('should create an action to indicate form loaded', () => {

            expect(formActions.loadFormSuccess("view", "someData")).toEqual({
                type: types.LOAD_FORM_SUCCESS,
                container: "view",
                formData: "someData"
            });
        });
    });

    describe('saving actions', () => {
        it('should create an action to indicate saving a form', () => {

            expect(formActions.savingForm("edit")).toEqual({type: types.SAVE_FORM, container: "edit"});
        });

        it('should create an action to indicate save form error', () => {

            expect(formActions.saveFormError("edit", "oops")).toEqual({
                type: types.SAVE_FORM_FAILED,
                container: "edit",
                error: "oops"
            });
        });

        it('should create an action to indicate form saved', () => {

            expect(formActions.saveFormSuccess("edit", "someData")).toEqual({
                type: types.SAVE_FORM_SUCCESS,
                container: "edit"
            });
        });
    });

    describe('syncForm actions', () => {
        it('should create an action to indicate syncing a form has begun', () => {

            expect(formActions.syncingForm()).toEqual({type: types.SYNCING_FORM});
        });
    });
});
