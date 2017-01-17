import React, {PropTypes} from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import QbIconActions from '../../../src/components/dataTable/qbGrid/qbIconActions';
import IconActions from '../../../src/components/actions/iconActions';

const props = {
    onClickEditRowIcon() {},
    onClickDeleteRowIcon() {}
};

const mockLocale = {
    getMessage(messageId) {
        switch (messageId) {
        case 'records.singular': return 'record';
        case 'selection.edit': return 'edit';
        case 'selection.print': return 'print';
        case 'selection.email': return 'email';
        case 'selection.copy': return 'copy';
        case 'selection.delete': return 'delete';
        default: expect(false).toEqual(true); // Try to access a different message key
        }
    }
};

const expectedActions = [
    {msg: 'edit record', rawMsg: true, className:'edit', icon:'edit', onClick: props.onClickEditRowIcon},
    {msg: 'print record', rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
    {msg: 'email record', rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
    {msg: 'copy record', rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
    {msg: 'delete record', rawMsg: true, className:'delete', icon:'delete', onClick: props.onClickDeleteRowIcon}
];

let component;

describe('QbIconActions', () => {
    beforeEach(() => {
        jasmineEnzyme();
        QbIconActions.__Rewire__('Locale', mockLocale);
    });

    afterEach(() => {
        QbIconActions.__ResetDependency__('Locale');
    });

    it('renders the icon actions', () => {
        component = shallow(<QbIconActions {...props} />);

        let IconActionsComponent = component.find(IconActions);
        expect(IconActionsComponent).toBePresent();
        expect(IconActionsComponent).toHaveProp('actions', expectedActions);
        expect(IconActionsComponent).toHaveProp('dropdownTooltip', true);
        expect(IconActionsComponent).toHaveProp('className', 'recordActions');
        expect(IconActionsComponent).toHaveProp('maxButtonsBeforeMenu', 1);
    });
});
