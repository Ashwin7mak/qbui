import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import RowActions from '../../../src/components/dataTable/qbGrid/rowActions';
import {PositionedRowEditActions} from '../../../src/components/dataTable/qbGrid/rowEditActions';
import QbIconActions from '../../../src/components/dataTable/qbGrid/qbIconActions';

let component;

const checkboxSelector = 'input[type="checkbox"]';

const rowId = 1;
const props = {
    rowId: rowId,
    isEditing: false,
    editingRowId: null,
    isEditingRowValid: true,
    isEditingRowSaving: true,
    isInlineEditOpen: false,
    editingRowErrors: [],
    onCancelEditingRow: function() {},
    onClickAddNewRow: function() {},
    onClickToggleSelectedRow: function() {},
    onClickSaveRow: function() {}
};

describe('RowActions (QbGrid)', () => {
    beforeEach(() => {
        jasmineEnzyme();
        // IconActions currently relies on the flux store which is difficult to unit test because of the mixin
        // TODO:: Refactor once redux stores are implemented
        QbIconActions.__Rewire__('IconActions', () => {return <div></div>;});
    });

    afterEach(() => {
        QbIconActions.__ResetDependency__('IconActions');
    });

    it('Renders the row actions', () => {
        component = shallow(<RowActions {...props} />);

        expect(component).toHaveClassName('actionsCol');

        let QbIconActionsInstance = component.find(QbIconActions);
        expect(QbIconActionsInstance).toBePresent();
        expect(QbIconActionsInstance).toHaveProp('onClickEditRowIcon', component.onClickEditRowIcon);
        expect(QbIconActionsInstance).toHaveProp('onClickDeleteRowIcon', component.onClickDeleteRowIcon);

        expect(component).not.toHaveClassName('emptyRowActions');
        expect(component).not.toContainReact(<PositionedRowEditActions />);

        let checkbox = component.find(checkboxSelector);
        expect(checkbox).toBePresent();
        expect(checkbox).not.toBeChecked();
    });

    let emptyColumnTestCases = [
        {
            description: 'Renders an empty div if inlineEditing is open',
            isInlineEditOpen: true,
            rowId: rowId
        },
        {
            description: 'Renders an empty div if no rowId is provided',
            isInlineEditOpen: false,
            rowId: null
        },
    ];

    emptyColumnTestCases.forEach(testCase => {
        it(testCase.description, () => {
            component = shallow(<RowActions {...props} isInlineEditOpen={testCase.isInlineEditOpen} rowId={testCase.rowId} />);

            expect(component).toHaveClassName('emptyRowActions');
            expect(component).not.toHaveClassName('actionsCol');
            expect(component.find(checkboxSelector)).toBeEmpty();
            expect(component.find(QbIconActions)).toBeEmpty();
            expect(component).not.toContainReact(<PositionedRowEditActions />);
        });
    });

    it('renders the row edit actions if the row being editing', () => {
        component = shallow(<RowActions
            {...props}
            isEditing={true}
            editingRowId={rowId}
        />);

        // Make sure the appropriate props are passed down to the RowEdit Actions
        let RowEditActions = component.find(PositionedRowEditActions);
        expect(RowEditActions).toBePresent();
        expect(RowEditActions).toHaveProp('idKey', rowId.toString());
        expect(RowEditActions).toHaveProp('rowId', rowId);
        expect(RowEditActions).toHaveProp('isValid', props.isEditingRowValid);
        expect(RowEditActions).toHaveProp('isSaving', props.isEditingRowSaving);
        expect(RowEditActions).toHaveProp('rowEditErrors', props.editingRowErrors);
        expect(RowEditActions).toHaveProp('onClose', props.onCancelEditingRow);
        expect(RowEditActions).toHaveProp('onClickCancel', props.onCancelEditingRow);
        expect(RowEditActions).toHaveProp('onClickAdd', props.onClickAddNewRow);
        expect(RowEditActions).toHaveProp('onClickSave', props.onClickSaveRow);
        expect(RowEditActions).toHaveProp('gridComponent', true);

        expect(component).not.toHaveClassName('emptyRowActions');
        expect(component).not.toHaveClassName('actionsCol');
        expect(component.find(checkboxSelector)).toBeEmpty();
        expect(component.find(QbIconActions)).toBeEmpty();
    });
});
