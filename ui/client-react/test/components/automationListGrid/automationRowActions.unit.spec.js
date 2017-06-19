import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TestUtils from 'react-addons-test-utils';

import AutomationRowActions from '../../../src/components/dataTable/automationListGrid/automationRowActions';
import RowActionsReuse from '../../../../reuse/client/src/components/rowActions/rowActions';
import IconActions from '../../../../reuse/client/src/components/iconActions/iconActions';
import {PositionedRowEditActions} from '../../../src/components/dataTable/qbGrid/rowEditActions';
import QbIconActions, {__RewireAPI__ as QbIconActionsRewireAPI} from '../../../src/components/dataTable/qbGrid/qbIconActions';

let component;

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
    onClickEditRowIcon: function() {},
    onClickDeleteRowIcon: function() {},
    onClickTestRowIcon: function() {}
};

const store = {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({})
};

const options = {
    context: {store},
    childContextTypes: {store: React.PropTypes.object.isRequired}
};

describe('AutomationRowActions (QbGrid)', () => {
    beforeEach(() => {
        jasmineEnzyme();
        QbIconActionsRewireAPI.__Rewire__('IconActions', () => {return <div></div>;});
    });

    afterEach(() => {
        QbIconActionsRewireAPI.__ResetDependency__('IconActions');
    });

    it('Renders automation row actions component', () => {
        component = mount(<AutomationRowActions {...props}/>, options);
        expect(component.find(RowActionsReuse)).toBePresent();
    });
});

