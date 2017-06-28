import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {__RewireAPI__ as RecordTrowserRewireAPI} from '../../src/components/record/recordTrowser';
import {RecordTrowser} from '../../src/components/record/recordTrowser';
import RecordTrowserStore from '../../src/components/record/recordTrowser';
import {UNSAVED_RECORD_ID, NEW_FORM_RECORD_ID} from '../../src/constants/schema';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Promise from 'bluebird';
import {Provider} from "react-redux";
import configureMockStore from 'redux-mock-store';

import {mount} from 'enzyme';

const appId = '1';
const tblId = '2';
const rptId = '3';
const recId = '4';
const prevId = '1';
const nextId = '20';

const mockStore = configureMockStore();
let store = {};

describe('RecordTrowser functions', () => {


    const record = {
        records: [
            {
                id: recId, recId: recId, nextRecordId: nextId, previousRecordId: prevId
            }
        ]
    };
    let obj = {
        recId: recId
    };
    let props = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        recId: recId,
        viewingRecordId: null,
        visible: true,
        editForm: {},
        errorPopupHidden: true,
        onHideTrowser: () => {},
        saveForm: (formType) => {},
        saveFormComplete: (formType) => {},
        syncForm: (formType) => {},
        hideErrorMsgDialog: () => {},
        showErrorMsgDialog: () => {},
        openRecord: (rec, next, prev) => {},
        editRecordCancel: (app, tbl, rec) => {},
        dispatch: (ev) => Promise.resolve(obj),
        reportData: {
            appId: appId,
            tblId: tblId,
            rptId: rptId,
            data: {
                keyField: {
                    name: 'recordId'
                },
                filteredRecords: [
                    {recordId: {value: prevId}},
                    {recordId: {value: recId}},
                    {recordId: {value: nextId}}
                ]
            }
        },
        record: record
    };
    var mockWindowUtils = {
        pushWithQuery: function() {},
        pushWithoutQuery: function() {}
    };

    var MockRecordComponent = React.createClass({
        render: function() {
            return <div>MockRecordComponent</div>;
        }
    });

    const storeContent = {
        record: record,
        shell: {
            errorPopupHidden: false
        }
    };
    beforeEach(() => {
        //  initialize the store to empty
        jasmineEnzyme();
        store = mockStore({});
        spyOn(mockWindowUtils, 'pushWithQuery').and.callThrough();
        spyOn(mockWindowUtils, 'pushWithoutQuery').and.callThrough();
        RecordTrowserRewireAPI.__Rewire__('WindowHistoryUtils', mockWindowUtils);
        // have to mock Record component as it requires redux store to be injected and don't want to have to
        // always inject a provider when testing certain recordTrowser component functionality
        RecordTrowserRewireAPI.__Rewire__('Record', MockRecordComponent);

        spyOn(props, 'dispatch').and.callThrough();
        spyOn(props, 'onHideTrowser').and.callThrough();
        spyOn(props, 'saveForm').and.callThrough();
        spyOn(props, 'saveFormComplete').and.callThrough();
        spyOn(props, 'syncForm').and.callThrough();
        spyOn(props, 'hideErrorMsgDialog').and.callThrough();
        spyOn(props, 'showErrorMsgDialog').and.callThrough();
        spyOn(props, 'openRecord').and.callThrough();
        spyOn(props, 'editRecordCancel').and.callThrough();
    });

    afterEach(() => {
        RecordTrowserRewireAPI.__ResetDependency__('WindowHistoryUtils');
        RecordTrowserRewireAPI.__ResetDependency__('Record');
        mockWindowUtils.pushWithQuery.calls.reset();
        mockWindowUtils.pushWithoutQuery.calls.reset();
        props.dispatch.calls.reset();
        props.onHideTrowser.calls.reset();
        props.saveForm.calls.reset();
        props.saveFormComplete.calls.reset();
        props.syncForm.calls.reset();
        props.hideErrorMsgDialog.calls.reset();
        props.showErrorMsgDialog.calls.reset();
        props.openRecord.calls.reset();
        props.editRecordCancel.calls.reset();
    });

    it('test render of loading component', () => {
        let component = TestUtils.renderIntoDocument(<RecordTrowser {...props}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of loading component via connect', () => {
        const initialState = {
            record: record
        };
        store = mockStore(initialState);
        let component = TestUtils.renderIntoDocument(<Provider store={store}><RecordTrowserStore {...props}/></Provider>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test cancelling from the record trowser', () => {
        let wrapper = mount(<RecordTrowser {...props}/>);
        const closeIcon = wrapper.find('.iconUISturdy-close');
        closeIcon.simulate('click');

        expect(props.editRecordCancel).toHaveBeenCalled();
        expect(mockWindowUtils.pushWithoutQuery).toHaveBeenCalled();
        expect(props.onHideTrowser).toHaveBeenCalled();
    });

    let saveButtonTestCases = [
        {name:'test click of save button for new record from trowser', recId:UNSAVED_RECORD_ID, clickSave:true, clickSaveAndNext: false},
        {name:'test click of save and add button for new record from trowser', recId:UNSAVED_RECORD_ID, clickSave:false, clickSaveAndNext: true},
        {name:'test click of save button for existing record from trowser', recId:recId, clickSave:true, clickSaveAndNext: false},
        {name:'test click of save and next button for existing record from trowser', recId:recId, clickSave:false, clickSaveAndNext: true}
    ];
    saveButtonTestCases.forEach(testCase => {
        it(testCase.name, () => {
            let wrapper = mount(<RecordTrowser {...props} recId={testCase.recId}/>);

            //  should be 2 buttons
            const buttons = wrapper.find('.saveOrCancelFooter .rightIcons .btn');
            expect(buttons.length).toBe(2);

            // get button based on test requirement
            const button = testCase.clickSaveAndNext ? buttons.first() : buttons.last();

            //  click the button
            button.simulate('click');
            expect(props.saveForm).toHaveBeenCalled();
            expect(props.dispatch).toHaveBeenCalledWith(jasmine.any(Function));
        });
    });

    const newRecStoreContent = {
        record: {
            records: [{
                pendEdits: {
                    hasAttemptedSave: true,
                    isPendingEdit: true,
                    recordChanges: {},
                    editErrors: {
                        errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]
                    }
                },
                id: NEW_FORM_RECORD_ID, recId: NEW_FORM_RECORD_ID, nextRecordId: nextId, previousRecordId: prevId
            }]
        },
        shell: {
            errorPopupHidden: false
        }
    };

    const updateRecStoreContent = {
        record: {
            records: [{
                pendEdits: {
                    hasAttemptedSave: true,
                    isPendingEdit: true,
                    recordChanges: {},
                    editErrors: {
                        errors: [{id: 4, invalidMessage: "error message #1", def: {fieldName: "test field"}}]
                    }
                },
                id: 4, recId: 4, nextRecordId: nextId, previousRecordId: prevId
            }]
        },
        shell: {
            errorPopupHidden: false
        }
    };
    let errorValidationTestCases = [
        {
            name: 'test saving new record that throws a validation error',
            recId: NEW_FORM_RECORD_ID,
            storeContent: newRecStoreContent
        },
        {
            name: 'test updating a record that throws a validation error',
            recId: recId,
            storeContent: updateRecStoreContent
        }
    ];
    errorValidationTestCases.forEach(testCase => {
        it(testCase.name, () => {
            let reject = function(ev) {
                return Promise.reject();
            };

            //  override the props.recId and props.dispatch
            let testStoreContent = testCase.storeContent || storeContent;
            let wrapper = mount(<RecordTrowser {...props} recId={testCase.recId} dispatch={reject} shell={testStoreContent.shell}
                                               record={testStoreContent.record}/>);
            const button = wrapper.find('.saveOrCancelFooter .rightIcons .btn').last();
            button.simulate('click');

            let errorMessageDialog = wrapper.find(".qbErrorMessage");
            expect(errorMessageDialog.length).toBe(1);

            // alert button to display
            let errorMessageAlertIcon = wrapper.find(".saveOrCancelFooter .rightIcons .saveAlertButton");
            expect(errorMessageAlertIcon.length).toBe(1);

            //  the popup error message window should be displayed...click close button
            let errorMessageCloseButton = wrapper.find(".qbErrorMessageHeader .rightIcons .btn").first();
            errorMessageCloseButton.simulate('click');
            expect(props.hideErrorMsgDialog).toHaveBeenCalled();
        });
    });

    it('test navigate to previous record', () => {
        let wrapper = mount(<RecordTrowser {...props} record={storeContent.record}/>);
        const closeIcon = wrapper.find('.iconActionButton .prevRecord');
        closeIcon.simulate('click');

        //  open previousRecId (1) ... so next will be recId(4) and previous will be undefined
        expect(props.openRecord).toHaveBeenCalledWith(prevId, recId, null);
        expect(mockWindowUtils.pushWithQuery).toHaveBeenCalled();
    });

    it('test navigate to next record', () => {
        let wrapper = mount(<RecordTrowser {...props} record={storeContent.record}/>);
        const closeIcon = wrapper.find('.iconActionButton .nextRecord');
        closeIcon.simulate('click');

        //  open nextRecId (20) ... so next will be undefined and previous will be recId(4)
        expect(props.openRecord).toHaveBeenCalledWith(nextId, null, recId);
        expect(mockWindowUtils.pushWithQuery).toHaveBeenCalled();
    });

    it('keyboardOnSave will save if the record trowser is visible', () => {
        let component = shallow(<RecordTrowser {...props} record={storeContent.record}/>);

        let instance = component.instance();
        spyOn(instance, 'saveClicked');
        instance.keyboardOnSave();

        expect(instance.saveClicked).toHaveBeenCalled();
    });

    it('keyboardOnSave will not save if the record trowser is not visible', () => {
        props.visible = false;
        let component = shallow(<RecordTrowser {...props} record={storeContent.record}/>);

        let instance = component.instance();
        spyOn(instance, 'saveClicked');
        instance.keyboardOnSave();

        expect(instance.saveClicked).not.toHaveBeenCalled();
    });

    it('when RecordChanges empty while creating a new record,clicking on save and add another,should not hide the trowser', () => {
        props.recId = null;
        let component = mount(<RecordTrowser {...props} record={storeContent.record}/>);
        let saveAndAddAnotherButton = component.find('.alternativeTrowserFooterButton');
        expect(saveAndAddAnotherButton.length).toBe(1);
        saveAndAddAnotherButton.simulate('click');
        expect(props.saveForm).toHaveBeenCalledWith('edit');
        expect(props.onHideTrowser).not.toHaveBeenCalled();
    });

});
