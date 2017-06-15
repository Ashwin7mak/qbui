import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import RowActions from 'REUSE/components/rowActions/rowActions';
import {PositionedRowEditActions} from 'APP/components/dataTable/qbGrid/rowEditActions';
import IconActions, {__RewireAPI__ as IconActionsRewireAPI} from 'REUSE/components/iconActions/iconActions';

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
    iconActionsNode: null,
    editingRowErrors: [],
    onCancelEditingRow() {},
    onClickAddNewRow() {},
    onClickToggleSelectedRow() {},
    onClickSaveRow() {}
};

describe('RowActions (Grid)', () => {
    beforeEach(() => {
        jasmineEnzyme();
        IconActionsRewireAPI.__Rewire__('IconActions', () => {return <div></div>;});
    });

    afterEach(() => {
        IconActionsRewireAPI.__ResetDependency__('IconActions');
    });

    it('Renders the row actions', () => {
        component = shallow(<RowActions {...props} />);

        expect(component).toHaveClassName('actionsCol');

        let IconActionsInstance = component.find(IconActions);
        expect(IconActionsInstance).toBePresent();
        expect(IconActionsInstance).toHaveProp('onClickEditRowIcon', component.onClickEditRowIcon);
        expect(IconActionsInstance).toHaveProp('onClickDeleteRowIcon', component.onClickDeleteRowIcon);

        expect(component).not.toHaveClassName('emptyRowActions');
        expect(component).not.toContainReact(<PositionedRowEditActions />);

        let checkbox = component.find(checkboxSelector);
        expect(checkbox).toBePresent();
        expect(checkbox).not.toBeChecked();
    });

    it('Renders an empty div if inlineEditing is open', () => {
        component = shallow(<RowActions {...props} isInlineEditOpen={true} rowId={rowId} />);

        expect(component).toHaveClassName('emptyRowActions');
        expect(component).not.toHaveClassName('actionsCol');
        expect(component.find(checkboxSelector)).toBeEmpty();
        expect(component.find(IconActions)).toBeEmpty();
        expect(component).not.toContainReact(<PositionedRowEditActions />);
    });

    it('renders the row edit actions if the row being editing', () => {
        component = shallow(<RowActions {...props} isEditing={true} editingRowId={rowId} />);

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
        expect(component.find(IconActions)).toBeEmpty();
    });

    it('does not render IconActions if iconActionsNode has some value', () => {
        component = shallow(<RowActions {...props} iconActionsNode={1} />);

        expect(component.find(IconActions)).not.toBePresent();
    });

    it('renders IconActions if iconActionsNode doesnt have any value', () => {
        component = shallow(<RowActions {...props} />);

        expect(component.find(IconActions)).toBePresent();
    });
});
