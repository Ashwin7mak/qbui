import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';

import {LinkToRecordFieldValueEditor} from '../../src/components/fields/linkToRecordFieldValueEditor';
import LinkToRecordTableSelectionDialog from '../../src/components/fields/linkToRecordTableSelectionDialog';

describe('LinkToRecordValueEditor functions', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
    });

    let component;

    const props = {
        showRelationshipDialog: () => {},
        readyToShowRelationshipDialog: true,
        updateField: () => {},
        removeFieldFromForm: () => {},
        tblId: "childTableId",
        tables: [
            {id: "childTableId", name: "childTable", tableIcon: "childIcon", tableNoun: "child"},
            {id: "parentTableId", name: "parentTable", tableIcon: "parentIcon", tableNoun: "parent"}
        ],
        childTableId: "childTableId",
        location: {},
        formId: 1,
        fieldDef: {}
    };

    it('renders LinkToRecordValueEditor component', () => {

        component = mount(<LinkToRecordFieldValueEditor {...props}/>);
        expect(component.find(LinkToRecordTableSelectionDialog)).toBePresent();
    });

    it('simulates selecting a table', () => {
        spyOn(props, "showRelationshipDialog");
        spyOn(props, "updateField");
        component = shallow(<LinkToRecordFieldValueEditor {...props}/>);

        component.instance().tableSelected("parentTableId");
        expect(props.showRelationshipDialog).toHaveBeenCalled();
        expect(props.updateField).toHaveBeenCalled();
    });

    it('simulates cancelling table selection', () => {
        spyOn(props, "removeFieldFromForm");
        component = shallow(<LinkToRecordFieldValueEditor {...props}/>);
        component.instance().cancelTableSelection();

        expect(props.removeFieldFromForm).toHaveBeenCalled();
    });
});
