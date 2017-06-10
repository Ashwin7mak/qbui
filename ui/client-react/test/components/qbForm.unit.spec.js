import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import _ from 'lodash';

import {QBForm, __RewireAPI__ as QbFormRewireAPI} from '../../src/components/QBForm/qbform';
import QBPanel from '../../src/components/QBPanel/qbpanel.js';

import {ChildReport} from '../../src/components/QBForm/childReport';
import thunk from 'redux-thunk';

import {
    buildTestArrayBasedFormData,
    textElementText,
    buildTestFormDataArrayWithTwoColumns,
    buildTestFormDataWithRelationship
} from '../testHelpers/testFormData';

const fakeQbFormData = buildTestArrayBasedFormData();
const testFormDataArrayWithTwoColumns = buildTestFormDataArrayWithTwoColumns();
const testFormDataWithRelationship = buildTestFormDataWithRelationship();

const emptyQBFormData = {
    formMeta: {
        "tabs": {
            "0": {
                "orderIndex": 0,
                "title": "tab0",
                "sections": {
                    "0": {
                        "orderIndex": 0,
                        "headerElement": {
                            "FormHeaderElement": {
                                "displayText": "ZyLnRkgRh1hrz6UDqp2ekiTSK5bSMFDxKnjIT7cjfvolWlw2rs",
                                "displayOptions": [
                                    "VIEW"
                                ],
                                "labelPosition": "LEFT",
                                "type": "HEADER"
                            }
                        },
                        "elements": {
                            "0": {
                                "SomeUnknownElement": {
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    record:[{id:2, value: "field value"}, {id:1, value: "built in field value"}],
    fields: [{id: 2, name: "field name", datatypeAttributes: {type: "TEXT"}}, {"builtIn": true, "datatypeAttributes": {"type": "DATE_TIME"}, "id": 1, "required": false, "type": "SCALAR", "name": "built in field name"}]
};

const storeFields = [{
    appId: 3,
    tblId: 2,
    fieldsLoading: false,
    fields: [
        {id: 6, name: "field 6", datatypeAttributes: {type: "TEXT"}},
        {id: 7, name: "field 7", datatypeAttributes: {type: "TEXT"}}
    ]
}];
const storeFieldsWithBuiltIns = [{
    appId: 3,
    tblId: 2,
    fieldsLoading: false,
    fields: [
        {id: 1, name: "field 1", builtIn: true},
        {id: 2, name: "field 2", builtIn: true},
        {id: 3, name: "field 3", builtIn: true},
        {id: 4, name: "field 4", builtIn: true},
        {id: 5, name: "field 5", builtIn: true},
        {id: 6, name: "field 6", datatypeAttributes: {type: "TEXT"}},
        {id: 7, name: "field 7", datatypeAttributes: {type: "TEXT"}}
    ]
}];

const FieldElementMock = React.createClass({
    render: function() {
        return (
            <div className="formElement field">{this.props.display}</div>
        );
    }
});
const DragAndDropMock = React.createClass({
    render: function() {
        return (
            <div>mock dragAndDrop</div>
        );
    }
});

const UserFieldValueRendererMock = React.createClass({
    render: function() {
        return (
            <div>mock UserFieldValueRenderer</div>
        );
    }
});

describe('QBForm', () => {
    beforeEach(() => {
        jasmineEnzyme();
        QbFormRewireAPI.__Rewire__('DragAndDropField', DragAndDropMock);
        QbFormRewireAPI.__Rewire__('FieldElement', FieldElementMock);
        QbFormRewireAPI.__Rewire__('UserFieldValueRenderer', UserFieldValueRendererMock);
    });

    afterEach(() => {
        QbFormRewireAPI.__ResetDependency__('DragAndDropField');
        QbFormRewireAPI.__ResetDependency__('FieldElement');
        QbFormRewireAPI.__ResetDependency__('UserFieldValueRenderer');
    });

    it('renders the component', () => {
        const component = shallow(<QBForm activeTab="0" formData={fakeQbFormData}/>);
        expect(component).toBePresent();
    });

    it('renders footer', () => {
        let qbFormData = _.cloneDeep(fakeQbFormData);
        qbFormData.formMeta.includeBuiltIns = true;
        qbFormData.record = [
            {id: 1, display:'display value 1', value: "2017-03-31T18:06:30.367Z[UTC]"},
            {id: 2, display:'display value 2', value: "2017-03-31T18:06:30.367Z[UTC]"},
            {id: 3, display:'display value 3', value: "field value 3"},
            {id: 4, display:'display value 4', value: {
                email: 'email',
                screenName: 'screenName'
            }},
            {id: 5, display:'display value 5', value: {
                email: 'email',
                screenName: 'screenName'
            }}
        ];
        const component = mount(<QBForm activeTab="0" formData={qbFormData} fields={storeFieldsWithBuiltIns}/>);
        const footer = component.find('.formFooter');
        expect(footer.length).toEqual(1);
    });

    it('renders tabs', () => {
        const component = mount(<QBForm activeTab="0" formData={fakeQbFormData} />);
        const tabs = component.find('.rc-tabs-tab');

        const expectedTabs = fakeQbFormData.formMeta.tabs.map(tab => tab.title);

        expect(tabs.length).toEqual(2);
        expectedTabs.forEach((tab, index) => {
            expect(tabs.at(index).text()).toEqual(tab);
        });

        expect(component.find('.noTabForm')).not.toBePresent();
    });

    it('does not render tabs if there is only one tab', () => {
        let formDataWithSingleTab = _.cloneDeep(fakeQbFormData);
        formDataWithSingleTab.formMeta.tabs = formDataWithSingleTab.formMeta.tabs.filter(tab => tab.orderIndex === 0);

        const component = mount(<QBForm activeTab="0" formData={formDataWithSingleTab} />);

        expect(component.find('.rc-tabs-tab')).not.toBePresent();
        expect(component.find('.noTabForm')).toBePresent();
    });

    it('renders sections', () => {
        const component = shallow(<QBForm activeTab="0" formData={fakeQbFormData} />);
        const sections = component.find('.formSection');

        let expectedSectionTitles = [];
        fakeQbFormData.formMeta.tabs.forEach(tab => {
            tab.sections.forEach(section => expectedSectionTitles.push(section.title));
        });

        expect(sections.length).toEqual(expectedSectionTitles.length);
        expectedSectionTitles.forEach((title, index) => {
            expect(sections.at(index).find(QBPanel)).toHaveProp('title', title);
        });
    });

    it('renders a single column', () => {
        const component = mount(<QBForm activeTab="1" formData={fakeQbFormData} />);
        const columns = component.find('.sectionColumn');

        expect(columns.length).toEqual(4);
        columns.forEach(column => {
            expect(column).toHaveStyle('width', '100%');
        });
    });

    it('renders multiple columns', () => {
        const component = mount(<QBForm activeTab="1" formData={testFormDataArrayWithTwoColumns} />);
        const columns = component.find('.sectionColumn');

        expect(columns.length).toEqual(2);
        columns.forEach(column => {
            expect(column).toHaveStyle('width', '50%');
        });
    });

    it('does not render relationship element if no relationships exist', () => {
        const component = mount(<QBForm activeTab="0" formData={fakeQbFormData} />);
        const childReport = component.find('.referenceElement');

        expect(childReport).not.toBePresent();
    });

    it('renders relationship elements if relationships exist', () => {
        const actualRelationship = testFormDataWithRelationship.formMeta.relationships[0];
        const middlewares = [thunk];

        const mockS = configureMockStore(middlewares);
        const store = mockS({
            fields: {},
            isTokenInMenuDragging: false,
            //form: {}
        });

        const component = mount(
            <MemoryRouter>
                <Provider store={store}>
                     <QBForm activeTab="0" formData={testFormDataWithRelationship}/>
                </Provider>
            </MemoryRouter>);

        const childReport = component.find('.referenceElement');
        const childReportComponent = component.find(ChildReport);

        expect(childReport).toBePresent();
        expect(childReportComponent).toHaveProp('appId', actualRelationship.appId);
        expect(childReportComponent).toHaveProp('childTableId', actualRelationship.detailTableId);
        expect(childReportComponent).toHaveProp('detailKeyFid', actualRelationship.detailFieldId);
    });

    it('renders text form elements', () => {
        const component = mount(<QBForm activeTab="1" formData={fakeQbFormData} />);
        const textElement = component.find('.formElement.text');

        expect(textElement.length).toEqual(1);
        expect(textElement.text()).toEqual(textElementText);
    });


    it('renders an empty section', () => {
        const component = mount(<QBForm activeTab="0" formData={emptyQBFormData} />);
        const fieldElements = component.find('.formElement');
        expect(fieldElements.length).toEqual(0);
    });

    it('renders for field elements with a location for use in dragging and dropping', () => {
        const component = mount(<QBForm activeTab="0" formData={fakeQbFormData} />);
        const fieldElement = component.find(FieldElementMock).first();

        expect(fieldElement).toHaveProp('location', {
            tabIndex: 0,
            sectionIndex: 0,
            columnIndex: 0,
            elementIndex: 0
        });
    });

    it('renders form field element with data from pendingEdits', () => {
        const editedValue = 'edited value';
        const editedDisplayValue = 'edited display';
        const edits = {
            recordChanges: {
                6: {
                    fieldName: 'test',
                    newVal: {value: editedValue, display: editedDisplayValue}
                }
            }
        };

        //  fields is now coming from redux, so pass in as a prop
        const component = mount(<QBForm activeTab="0" formData={fakeQbFormData} pendEdits={edits} fields={storeFields} />);
        const fieldElements = component.find('.formTable').first().find(FieldElementMock);
        expect(fieldElements.length).toEqual(4);

        let actualProps = fieldElements.at(0).props().fieldRecord;
        expect(actualProps.value).toEqual(editedValue);
        expect(actualProps.display).toEqual(editedDisplayValue);
    });

    it('renders form field element with editErrors', () => {
        const invalidMessage = 'invalid';
        const edits = {
            recordChanges: {
                6: {
                    fieldName: 'test', newVal: {value: 'value', display: 'display'}
                }
            },
            editErrors: {
                errors: [
                    {
                        id: 6,
                        isInvalid: true,
                        invalidMessage: invalidMessage
                    }
                ]
            }
        };

        const component = mount(<QBForm activeTab={"0"} formData={fakeQbFormData} pendEdits={edits} fields={storeFields}/>);
        const fieldElements = component.find('.formTable').first().find(FieldElementMock);
        expect(fieldElements.length).toEqual(4);

        let actualProps = fieldElements.at(0).props();
        expect(actualProps.isInvalid).toEqual(true);
        expect(actualProps.invalidMessage).toEqual(invalidMessage);
    });
});
