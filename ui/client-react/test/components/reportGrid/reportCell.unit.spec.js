import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReportCell from '../../../src/components/dataTable/reportGrid/reportCell';
import CellValueRenderer from '../../../src/components/dataTable/agGrid/cellValueRenderer';
import FieldValueEditor from '../../../src/components/fields/fieldValueEditor';
import {TEXT} from '../../../src/constants/schema';
import FieldFormats from '../../../src/utils/fieldFormats';

const actions = {
    onCellChange() {},
    onCellBlur() {},
    onCellClick() {},
    onCellClickEditIcon() {}
};

const testRecordId = 13;
const testFieldName = 'text field 1';
const uniqueElementKey = 'text-field-1';
const fieldDef = {
    name: testFieldName,
    datatypeAttributes: {type: TEXT},
    userEditableValue: true,
};
const uneditableField = Object.assign({}, fieldDef, {userEditableValue: false});


let component;
let instance;

describe('ReportCell', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a fieldValueRender when the cell is not being edited', () => {
        component = shallow(<ReportCell {...actions} isEditing={false} fieldDef={fieldDef}/>);

        let cellRenderer = component.find(CellValueRenderer);
        expect(cellRenderer).toBePresent();
        expect(cellRenderer).toHaveProp('type', FieldFormats.TEXT_FORMAT);
        expect(cellRenderer).toHaveProp('attributes', fieldDef.datatypeAttributes);
        expect(cellRenderer).toHaveProp('includeUnits', false);
        expect(cellRenderer).toHaveProp('hideUncheckedCheckbox', true);

        expect(component.find(FieldValueEditor)).toBeEmpty();
    });

    it('has a clickable edit icon when the field is editable', () => {
        spyOn(actions, 'onCellClickEditIcon');
        component = shallow(<ReportCell {...actions} isEditing={false} fieldDef={fieldDef} recordId={testRecordId}/>);

        let editButton = component.find('.cellEditIcon');
        expect(editButton).toBePresent();

        editButton.simulate('click', {stopPropagation() {}});

        expect(actions.onCellClickEditIcon).toHaveBeenCalledWith(testRecordId, fieldDef);
    });

    it('does not have a clickable edit icon when the field is not editable', () => {
        component = shallow(<ReportCell {...actions} isEditing={false} fieldDef={uneditableField} recordId={testRecordId}/>);

        expect(component.find('.cellEditIcon')).toBeEmpty();
    });

    it('does not have a clickable edit icon when the row is in editing mode', () => {
        component = shallow(<ReportCell {...actions} isEditing={true} fieldDef={uneditableField} recordId={testRecordId}/>);

        expect(component.find('.cellEditIcon')).toBeEmpty();
    });

    it('does not have a clickable edit icon when another row is in editing mode', () => {
        component = shallow(<ReportCell {...actions} isEditing={false} editingRecordId={99} fieldDef={uneditableField} recordId={testRecordId}/>);

        expect(component.find('.cellEditIcon')).toBeEmpty();
    });

    it('navigates to form view when a cell is clicked', () => {
        spyOn(actions, 'onCellClick');
        component = shallow(<ReportCell {...actions} isEditing={false} fieldDef={fieldDef} recordId={testRecordId}/>);

        let cellClickableArea = component.find('.cellClickableArea');
        cellClickableArea.simulate('click');

        expect(actions.onCellClick).toHaveBeenCalledWith(testRecordId);
    });

    it('renders an editor when the cell is in editing mode', () => {
        const appUsers = ['user1', 'user2', 'user3'];
        component = shallow(<ReportCell
            {...actions}
            isEditing={true}
            fieldDef={fieldDef}
            recordId={testRecordId}
            uniqueElementKey={uniqueElementKey}
            appUsers={appUsers}
            isInvalid={false}
        />);
        instance = component.instance();

        let fieldValueEditor = component.find(FieldValueEditor);
        expect(fieldValueEditor).toBePresent();
        expect(fieldValueEditor).toHaveProp('type', FieldFormats.TEXT_FORMAT);
        expect(fieldValueEditor).toHaveProp('fieldDef', fieldDef);
        expect(fieldValueEditor).toHaveProp('fieldName', fieldDef.name);
        expect(fieldValueEditor).toHaveProp('idKey', `fve-${uniqueElementKey}`);
        expect(fieldValueEditor).toHaveProp('appUsers', appUsers);
        expect(fieldValueEditor).toHaveProp('indicateRequired', true);

        expect(component.find(CellValueRenderer)).toBeEmpty();
    });

    it('renders a cell renderer if the cell is in edit mode, but the field is uneditable', () => {
        component = shallow(<ReportCell
            {...actions}
            isEditing={true}
            fieldDef={uneditableField}
        />);

        expect(component.find(CellValueRenderer)).toBePresent();
        expect(component.find(FieldValueEditor)).toBeEmpty();
    });

    describe('componentDidUpdate', () => {
        let testCases = [
            {
                description: 'focuses the first input of an edit cell when hasFocusOnEditStart is true',
                isEditing: true,
                focusShouldHaveBeenCalled: true
            },
            {
                description: 'does not focus the first input if the cell is not in edit mode',
                isEditing: false,
                focusShouldHaveBeenCalled: false
            }
        ];

        // Using TestUtils for this test so that the nested components can be rendered and checked
        testCases.forEach(testCase => {
            it(testCase.description, () => {
                const StatefulParentWithReportCell = React.createClass({
                    getInitialState() {return {hasFocusOnEditStart: false};},
                    toggleHasFocusOnEditStart() {this.setState({hasFocusOnEditStart: !this.state.hasFocusOnEditStart});},
                    render() {return <ReportCell {...actions} isEditing={testCase.isEditing} fieldDef={fieldDef} hasFocusOnEditStart={this.state.hasFocusOnEditStart}/>;}
                });

                component = TestUtils.renderIntoDocument(<StatefulParentWithReportCell/>);
                instance = TestUtils.findRenderedComponentWithType(component, ReportCell);

                spyOn(instance, 'focusFieldValueEditorFirstInput').and.callThrough();

                component.toggleHasFocusOnEditStart();

                if (testCase.focusShouldHaveBeenCalled) {
                    expect(instance.focusFieldValueEditorFirstInput).toHaveBeenCalled();
                } else {
                    expect(instance.focusFieldValueEditorFirstInput).not.toHaveBeenCalled();
                }
            });
        });
    });


});
