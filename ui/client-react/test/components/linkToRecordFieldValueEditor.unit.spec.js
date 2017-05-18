import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';

import {LinkToRecordFieldValueEditor} from '../../src/components/fields/linkToRecordFieldValueEditor';


describe('LinkToRecordValueEditor functions', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
    });

    let component;

    const props = {
        showRelationshipDialog: () => {},
        readyToShowRelationshipDialog: false,
        updateField: () => {},
        removeFieldFromForm: () => {},
        tblId: "childTableId",
        tables: [],
        location: {},
        formId: 1
    };

    it('renders LinkToRecordValueEditor component', () => {

        component = shallow(<LinkToRecordFieldValueEditor {...props}/>);
        expect(component.find(LinkToRecordFieldValueEditor)).toBePresent();
    });
});
