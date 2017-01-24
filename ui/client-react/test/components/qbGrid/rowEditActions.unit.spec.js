import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {RowEditActions} from '../../../src/components/dataTable/qbGrid/rowEditActions';
import QBToolTip from '../../../src/components/qbToolTip/qbToolTip';
import Loader  from 'react-loader';
import Button from 'react-bootstrap/lib/Button';

const rowId = 1;
const actions = {
    onClickAdd() {},
    onClickSave() {},
    onClickCancel() {},
};

let component;

describe('RowEditActions (QbGrid)', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders the RowEditActions component', () => {
        component = shallow(<RowEditActions/>);

        let editTools = component.find('.editTools');
        expect(editTools).toBePresent();
    });

    it('has tooltips for each action', () => {
        component = shallow(<RowEditActions/>);

        let qbToolTips = component.find(QBToolTip);
        expect(qbToolTips.find({tipId: 'cancelSelection'})).toBePresent();
        expect(qbToolTips.find({tipId: 'invalidRecord'})).toBePresent();
        expect(qbToolTips.find({tipId: 'addRecord'})).toBePresent();
    });

    it('displays the error button (invalid record) by default', () => {
        component = shallow(<RowEditActions/>);

        expect(component.find('rowEditActionsSave')).not.toBePresent();
        expect(component.find('.invalidRecord')).toBePresent();
        expect(component.find('.spinner')).toBeEmpty();
    });

    it('displays the number of validation errors in the tooltip', () => {
        const rowEditErrors = ['error1', 'error2', 'error3'];
        component = shallow(<RowEditActions rowEditErrors={rowEditErrors} isValid={false}/>);

        expect(component.find(QBToolTip).find({numErrors: rowEditErrors.length})).toBePresent();
        expect(component.find(QBToolTip).find({i18nMessageKey: 'editErrors'})).toBePresent();
    });

    it('disables the "Save and Add New Record" button when invalid', () => {
        component = shallow(<RowEditActions isValid={false}/>);

        expect(component.find(Button).find({className: 'addRecord disabled'})).toBePresent();
    });

    it('displays a loading icon if the record isSaving and disables the add button', () => {
        component = shallow(<RowEditActions isSaving={true}/>);

        expect(component.find(Loader)).toHaveProp('loaded', false);
        expect(component.find(Button).find({className: 'addRecord disabled'})).toBePresent();
    });

    describe('RowEditActions action calls', () => {
        beforeEach(() => {
            jasmineEnzyme();

            Object.keys(actions).forEach(key => {
                spyOn(actions, key);
            });
        });

        it('calls the save method when the save button is clicked', () => {
            component = shallow(<RowEditActions onClickSave={actions.onClickSave} isValid={true} rowId={rowId}/>);

            let saveButton = component.find(Button).find({className: 'rowEditActionsSave'});
            saveButton.simulate('click');

            expect(actions.onClickSave).toHaveBeenCalledWith(rowId);
            expect(actions.onClickAdd).not.toHaveBeenCalled();
            expect(actions.onClickCancel).not.toHaveBeenCalled();
        });

        it('calls the cancel method when the cancel button is clicked', () => {
            component = shallow(<RowEditActions onClickCancel={actions.onClickCancel} isValid={true} rowId={rowId}/>);

            let saveButton = component.find(Button).find({className: 'rowEditActionsCancel'});
            saveButton.simulate('click');

            expect(actions.onClickCancel).toHaveBeenCalledWith(rowId);
            expect(actions.onClickSave).not.toHaveBeenCalled();
            expect(actions.onClickAdd).not.toHaveBeenCalled();
        });

        it('calls the "add new record" method when the "Add new" button is clicked', () => {
            component = shallow(<RowEditActions onClickCancel={actions.onClickAdd} isValid={true} rowId={rowId}/>);

            let saveButton = component.find(Button).find({className: 'rowEditActionsCancel'});
            saveButton.simulate('click');

            expect(actions.onClickAdd).toHaveBeenCalledWith(rowId);
            expect(actions.onClickSave).not.toHaveBeenCalled();
            expect(actions.onClickCancel).not.toHaveBeenCalled();
        });

        it('does not called the "add new record" method if the record is invalid', () => {
            component = shallow(<RowEditActions onClickCancel={actions.onClickAdd} isValid={false} rowId={rowId}/>);

            let saveButton = component.find(Button).find({className: 'rowEditActionsCancel'});
            saveButton.simulate('click');

            expect(actions.onClickAdd).not.toHaveBeenCalledWith();
            expect(actions.onClickSave).not.toHaveBeenCalled();
            expect(actions.onClickCancel).not.toHaveBeenCalled();
        });
    });
});
