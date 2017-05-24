import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {ReportNameEditor} from '../../../src/components/reportBuilder/reportNameEditor';

const testPropsNotInBuilderMode = {
    name: 'Test',
    isInBuilderMode: false
};

const testPropsInBuilderMode = {
    name: 'Test',
    isInBuilderMode: true
};

let component;

describe('ReportNameEditor', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {

    });

    describe('Render', () => {
        it('renders a non-editable h3 tag of the report name when not in builder mode', () => {
            component = mount(<ReportNameEditor {...testPropsNotInBuilderMode}/>);
            let h3 = component.find({className: 'nonEditableReportName'});
            expect(h3.length).toEqual(1);
        });

        it('renders an editable TextFieldValueEditor when in builder mode', () => {
            component = mount(<ReportNameEditor {...testPropsInBuilderMode}/>);
            let text = component.find({className: 'editor'});
            expect(text.length).toEqual(1);
        });
    });
});
