import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {mount} from 'enzyme';
import {RecordActions}  from '../../src/components/actions/recordActions';
import * as SchemaConsts from "../../src/constants/schema";

describe('RecordActions functions', () => {
    'use strict';

    let props = {
        appId: '1',
        tblId: '2',
        deleteRecord: () => {},
        onEditAction: () => {}
    };

    beforeEach(() => {
        spyOn(props, 'deleteRecord');
        spyOn(props, 'onEditAction');
    });

    afterEach(() => {
        props.deleteRecord.calls.reset();
        props.onEditAction.calls.reset();
    });

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<RecordActions {...props}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test edit action button', () => {
        let wrapper = mount(<RecordActions {...props}/>);
        const editAction = wrapper.find('a.iconLink.icon-edit');

        //  click the edit button
        editAction.simulate('click');
        expect(props.onEditAction).toHaveBeenCalled();
    });

    it('test delete action button', () => {
        let wrapper = mount(<RecordActions {...props}/>);
        const a = wrapper.find('a.iconLink.icon-delete');
        const deleteAction = wrapper.find('a').last();

        //  click the delete button..this is to just exercise the callback..doesn't
        //  actually exercise the delete code as it would trigger a confirm page..
        deleteAction.simulate('click');
        //  ..instead, call the delete function to ensure redux deleteRecord action is called.
        var buttons = wrapper.instance().handleRecordDelete();
        expect(props.deleteRecord).toHaveBeenCalled();
    });
});
