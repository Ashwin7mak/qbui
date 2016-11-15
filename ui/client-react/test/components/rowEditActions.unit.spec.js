import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {DEFAULT_RECORD_KEY, DEFAULT_RECORD_KEY_ID} from '../../src/constants/schema';

import RowEditActions from '../../src/components/dataTable/agGrid/rowEditActions';

describe('RowEditActions', () => {
    let component;

    const currentlyEditingRecordId = 13;

    const data = {
        'Some other Field': {
            id: 1,
            value: 'Some other value',
            display: 'Some other value'
        }
    };
    data[DEFAULT_RECORD_KEY] = {id: DEFAULT_RECORD_KEY_ID, value: currentlyEditingRecordId, display: currentlyEditingRecordId};

    const dataWithDifferentRecordKeyName = {
        'Some other Field': {
            id: 1,
            value: 'Some other value',
            display: 'Some other value'
        }
    };
    dataWithDifferentRecordKeyName['Employee Id'] = {id: DEFAULT_RECORD_KEY_ID, value: currentlyEditingRecordId, display: currentlyEditingRecordId};

    const saveFunctionName = 'onRecordSaveClicked';
    const cancelFunctionName = 'onEditRecordCancel';
    const saveAndAddFunctionName = 'onRecordNewBlank';
    const mockParams = {context: {
        onRecordSaveClicked(_id) {},
        onEditRecordCancel(_id) {},
        onRecordNewBlank(_id) {}
    }};

    const mockApi = {
        deselectAll() {}
    };

    const mockFlux = {
        actions: {
            selectedRows(_rowArray) {}
        }
    };

    const saveButtonClass = 'rowEditActionsSave';
    const cancelButtonClass = 'rowEditActionsCancel';
    const saveAndAddButtonClass = 'rowEditActionsSaveAndAdd';

    it('should render without errors', () => {
        component = TestUtils.renderIntoDocument(<RowEditActions />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    /**
     * Testing Note:
     * Historically, this class looked for a field called "Record ID#" to find the id of the record.
     * This has been modified and tests are doubled for cases where the id field is called "Record ID#"
     * and when that field is called something else to make sure that we are not relying on the field name
     * which may change.
     */
    let testCases = [
        {
            description: 'calls the save method when the save button is clicked with the correct ID',
            data: data,
            buttonClass: saveButtonClass,
            expectedFunction: saveFunctionName
        },
        {
            description: 'calls the save method when the save button is clicked with the correct ID',
            data: dataWithDifferentRecordKeyName,
            buttonClass: saveButtonClass,
            expectedFunction: saveFunctionName
        },
        {
            description: 'calls the cancel method when the cancel button is clicked with the correct ID',
            data: dataWithDifferentRecordKeyName,
            buttonClass: cancelButtonClass,
            expectedFunction: cancelFunctionName
        },
        {
            description: 'calls the cancel method when the cancel button is clicked with the correct ID',
            data: dataWithDifferentRecordKeyName,
            buttonClass: cancelButtonClass,
            expectedFunction: cancelFunctionName
        },
        {
            description: 'calls the save and add method when the save and add button is clicked with the correct ID',
            data: dataWithDifferentRecordKeyName,
            buttonClass: saveAndAddButtonClass,
            expectedFunction: saveAndAddFunctionName
        },
        {
            description: 'calls the save and add method when the save and add button is clicked with the correct ID',
            data: dataWithDifferentRecordKeyName,
            buttonClass: saveAndAddButtonClass,
            expectedFunction: saveAndAddFunctionName
        },
    ];
    testCases.forEach(testCase => {
        it(testCase.description, () => {
            component = TestUtils.renderIntoDocument(<RowEditActions data={testCase.data} api={mockApi} params={mockParams} flux={mockFlux} />);

            spyOn(mockParams.context, testCase.expectedFunction);

            let button = TestUtils.findRenderedDOMComponentWithClass(component, testCase.buttonClass);

            Simulate.click(button);

            expect(mockParams.context[testCase.expectedFunction]).toHaveBeenCalledWith({display: currentlyEditingRecordId, id: DEFAULT_RECORD_KEY_ID, value: currentlyEditingRecordId});
        });
    });
});
