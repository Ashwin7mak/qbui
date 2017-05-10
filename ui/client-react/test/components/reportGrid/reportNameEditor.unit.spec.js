import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TestUtils from 'react-addons-test-utils';

import {ReportNameEditor} from '../../../src/components/report/reportNameEditor';

const testPropsNotInBuilderMode = {
    onChangeUpdateName: (name) => {},
    reportBuilder: {
        inBuilderMode: false
    }
};

const testPropsInBuilderMode = {
    name: 'Test',
    onChangeUpdateName: (name) => {},
    reportBuilder: {
        inBuilderMode: true
    }
};

let component;
let instance;

describe('ReportNameEditor', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(testPropsInBuilderMode, 'onChangeUpdateName').and.callThrough();
    });

    afterEach(() => {
        testPropsInBuilderMode.onChangeUpdateName.calls.reset();
    });

    describe('Render', () => {
        it('renders a non-editable h3 tag of the report name when not in builder mode', () => {
            component = TestUtils.renderIntoDocument(<ReportNameEditor {...testPropsNotInBuilderMode}/>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
            let value = TestUtils.scryRenderedDOMComponentsWithClass(component, 'nonEditableReportName');
            // shows that it found the h3 tag with the className nonEditableReportName
            expect(value.length).toEqual(1);
        });

        it('renders an editable TextFieldValueEditor when in builder mode', () => {
            component = TestUtils.renderIntoDocument(<ReportNameEditor {...testPropsInBuilderMode}/>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
            let value = TestUtils.scryRenderedDOMComponentsWithClass(component, 'editor');
            // shows that it found the div wrapping the TextFieldValueEditor with className editor
            expect(value.length).toEqual(1);
        });
    });

    describe('updateName', () => {
        it('calls the onChangeUpdateName prop', () => {
            component = mount(<ReportNameEditor {...testPropsInBuilderMode}/>);
            instance = component.instance();

            instance.updateName('New Name');

            expect(testPropsInBuilderMode.onChangeUpdateName).toHaveBeenCalledWith('New Name');
        });

        it('sets the state to the new name', () => {
            component = mount(<ReportNameEditor {...testPropsInBuilderMode}/>);
            instance = component.instance();

            instance.updateName('New Name');

            expect(instance.state.name).toEqual('New Name');
        });
    });
});
