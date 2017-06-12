import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import RowActions from '../../../src/components/dataTable/qbGrid/rowActions';
import RowActionsReuse from '../../../../reuse/client/src/components/rowActions/rowActions';
import IconActions from '../../../../reuse/client/src/components/iconActions/iconActions';
import {PositionedRowEditActions} from '../../../src/components/dataTable/qbGrid/rowEditActions';
import QbIconActions, {__RewireAPI__ as QbIconActionsRewireAPI} from '../../../src/components/dataTable/qbGrid/qbIconActions';

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
    onClickSaveRow: function() {},
};

describe('RowActions (QbGrid)', () => {
    beforeEach(() => {
        jasmineEnzyme();
        // TODO:: Refactor once redux stores are implemented. https://quickbase.atlassian.net/browse/MB-1920
        QbIconActionsRewireAPI.__Rewire__('IconActions', () => {return <div></div>;});
    });

    afterEach(() => {
        QbIconActionsRewireAPI.__ResetDependency__('IconActions');
    });

    it('Renders the row actions component', () => {
        component = shallow(<RowActions {...props}/>);

        expect(component.find(RowActionsReuse)).toBePresent();
    });

    it('Checks the row actions component has props', () => {

        component = mount(<RowActions {...props}/>);

        let QbIconActionsInstance = component.find(QbIconActions);

        expect(QbIconActionsInstance).toHaveProp('onClickEditRowIcon', component.onClickEditRowIcon);
        expect(QbIconActionsInstance).toHaveProp('onClickDeleteRowIcon', component.onClickDeleteRowIcon);
    });
});
