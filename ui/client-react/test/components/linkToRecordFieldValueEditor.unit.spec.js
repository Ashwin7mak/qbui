import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';

import {LinkToRecordFieldValueEditor, __RewireAPI__ as LinkToRecordFieldValueEditorRewireAPI} from '../../src/components/fields/linkToRecordFieldValueEditor';
import MultiChoiceFieldValueEditor from '../../src/components/fields/multiChoiceFieldValueEditor';
import LinkToRecordTableSelectionDialog from '../../src/components/fields/linkToRecordTableSelectionDialog';
import _ from 'lodash';

describe('LinkToRecordValueEditor functions', () => {
    let component;

    //props object for a form builder
    let newRecordProps = {};

    //props object for a edit/view form
    let existingRecordProps = {};

    const parentTableFields = {id: 1, datatypeAttributes: {type: 'TEXT'}};
    //common props
    const props = {
        hideRelationshipDialog: () => {},
        updateField: () => {},
        removeFieldFromForm: () => {},
        tblId: "childTableId",
        tables: [
            {
                id: "childTableId",
                name: "childTable",
                tableIcon: "childIcon",
                tableNoun: "child",
                fields: []
            },
            {
                id: "parentTableId",
                name: "parentTable",
                tableIcon: "parentIcon",
                tableNoun: "parent",
                fields: [
                    parentTableFields
                ]
            }
        ],
        childTableId: "childTableId",
        location: {},
        formId: 1,
        fieldDef: {id: 'newFieldId', parentFieldId: 'parentFieldId'}
    };

    beforeEach(() => {
        jasmineEnzyme();
        newRecordProps = {newFormFieldId: 'newFieldId'};
        newRecordProps = Object.assign(newRecordProps, _.clone(props));
        existingRecordProps = {};
        existingRecordProps = Object.assign(existingRecordProps, _.clone(props));
    });

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.tableDataConnectionDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('renders LinkToRecordValueEditor component', () => {
        component = mount(<LinkToRecordFieldValueEditor {...newRecordProps}/>);
        expect(component.find(LinkToRecordTableSelectionDialog)).toBePresent();
    });

    it('simulates selecting a table', () => {
        spyOn(newRecordProps, "hideRelationshipDialog");
        spyOn(newRecordProps, "updateField");
        component = shallow(<LinkToRecordFieldValueEditor {...newRecordProps}/>);

        component.instance().relationshipSelected("parentTableId", parentTableFields);
        expect(newRecordProps.hideRelationshipDialog).toHaveBeenCalled();
        expect(newRecordProps.updateField).toHaveBeenCalled();
    });

    it('simulates cancelling table selection', () => {
        spyOn(newRecordProps, "removeFieldFromForm");
        component = shallow(<LinkToRecordFieldValueEditor {...newRecordProps}/>);
        component.instance().cancelTableSelection();

        expect(newRecordProps.removeFieldFromForm).toHaveBeenCalled();
    });

    it('renders a multichoicefieldeditor for edit form', () => {
        component = mount(<LinkToRecordFieldValueEditor {...existingRecordProps}/>);
        expect(component.find(MultiChoiceFieldValueEditor)).toBePresent();
    });

    it('populates multichoicefieldeditor with choices on open', () => {
        class mockRecordService {
            getRecords() {
                return Promise.resolve({data: {records: [[{id: 'parentFieldId', value: "one", display: "one"}]]}});
            }
        }
        const MultiChoiceFVE = React.createClass({
            render() {
                return <button onClick={() => this.props.onOpen()}>something </button>;
            }
        });
        LinkToRecordFieldValueEditorRewireAPI.__Rewire__('RecordService', mockRecordService);
        LinkToRecordFieldValueEditorRewireAPI.__Rewire__('MultiChoiceFieldValueEditor', MultiChoiceFVE);
        spyOn(mockRecordService.prototype, 'getRecords').and.callThrough();
        component = mount(<LinkToRecordFieldValueEditor {...existingRecordProps}/>);
        let selector = component.find(MultiChoiceFVE);
        selector.simulate('click');
        expect(mockRecordService.prototype.getRecords).toHaveBeenCalled();
        LinkToRecordFieldValueEditorRewireAPI.__ResetDependency__('RecordService');
        LinkToRecordFieldValueEditorRewireAPI.__ResetDependency__('MultiChoiceFieldValueEditor');
    });
});
