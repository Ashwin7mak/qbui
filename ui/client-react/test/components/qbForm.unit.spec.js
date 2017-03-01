import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import _ from 'lodash';

import QBForm, {__RewireAPI__ as QbFormRewireAPI} from '../../src/components/QBForm/qbform';
import QBPanel from '../../src/components/QBPanel/qbpanel.js';
import {TabPane} from 'rc-tabs';
import RelatedChildReport from '../../src/components/QBForm/relatedChildReport';
import {MobileDropTarget} from '../../src/components/formBuilder/mobileDropTarget';

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

var FieldElementMock = React.createClass({
    render: function() {
        return (
            <div className="formElement field">{this.props.display}</div>
        );
    }
});

let component;

describe('QBForm', () => {
    beforeEach(() => {
        jasmineEnzyme();
        QbFormRewireAPI.__Rewire__('FieldElement', FieldElementMock);
    });

    afterEach(() => {
        QbFormRewireAPI.__ResetDependency__('FieldElement');
    });

    it('renders the component', () => {
        component = shallow(<QBForm activeTab="0" formData={fakeQbFormData}/>);
        expect(component).toBePresent();
    });

    it('renders tabs', () => {
        component = mount(<QBForm activeTab="0" formData={fakeQbFormData} />);
        let tabs = component.find('.rc-tabs-tab');

        let expectedTabs = fakeQbFormData.formMeta.tabs.map(tab => tab.title);

        expect(tabs.length).toEqual(2);
        expectedTabs.forEach((tab, index) => {
            expect(tabs.at(index).text()).toEqual(tab);
        });

        expect(component.find('.noTabForm')).not.toBePresent();
    });

    it('does not render tabs if there is only one tab', () => {
        let formDataWithSingleTab = _.cloneDeep(fakeQbFormData);
        formDataWithSingleTab.formMeta.tabs = formDataWithSingleTab.formMeta.tabs.filter(tab => tab.orderIndex === 0);

        component = mount(<QBForm activeTab="0" formData={formDataWithSingleTab} />);

        expect(component.find('.rc-tabs-tab')).not.toBePresent();
        expect(component.find('.noTabForm')).toBePresent();
    });

    it('renders sections', () => {
        component = shallow(<QBForm activeTab="0" formData={fakeQbFormData} />);
        let sections = component.find('.formSection');

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
        component = mount(<QBForm activeTab="1" formData={fakeQbFormData} />);
        let columns = component.find('.sectionColumn');

        expect(columns.length).toEqual(4);
        columns.forEach(column => {
            expect(column).toHaveStyle('width', '100%');
        });
    });

    it('renders multiple columns', () => {
        component = mount(<QBForm activeTab="1" formData={testFormDataArrayWithTwoColumns} />);
        let columns = component.find('.sectionColumn');

        expect(columns.length).toEqual(2);
        columns.forEach(column => {
            expect(column).toHaveStyle('width', '50%');
        });
    });

    it('does not render relationship element if no relationships exist', () => {
        component = mount(<QBForm activeTab="0" formData={fakeQbFormData} />);
        let childReport = component.find('.referenceElement');

        expect(childReport).not.toBePresent();
    });

    it('renders relationship elements if relationships exist', () => {
        const actualRelationship = testFormDataWithRelationship.formMeta.relationships[0];

        component = mount(<QBForm activeTab="0" formData={testFormDataWithRelationship}/>);
        let childReport = component.find('.referenceElement');
        let childReportComponent = component.find(RelatedChildReport);

        expect(childReport).toBePresent();
        expect(childReportComponent).toHaveProp('appId', actualRelationship.appId);
        expect(childReportComponent).toHaveProp('childTableId', actualRelationship.detailTableId);
        expect(childReportComponent).toHaveProp('detailKeyFid', actualRelationship.detailFieldId);
    });

    it('renders text form elements', () => {
        component = mount(<QBForm activeTab="1" formData={fakeQbFormData} />);
        let textElement = component.find('.formElement.text');

        expect(textElement.length).toEqual(1);
        expect(textElement.text()).toEqual(textElementText);
    });


    it('renders an empty section', () => {
        component = mount(<QBForm activeTab="0" formData={emptyQBFormData} />);
        let fieldElements = component.find('.formElement');
        expect(fieldElements.length).toEqual(0);
    });

    it('renders for field elements with a location for use in dragging and dropping', () => {
        component = mount(<QBForm activeTab="0" formData={fakeQbFormData} />);
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

        component = mount(<QBForm activeTab="0" formData={fakeQbFormData} pendEdits={edits} />);
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

        component = mount(<QBForm activeTab={"0"} formData={fakeQbFormData} pendEdits={edits} />);
        const fieldElements = component.find('.formTable').first().find(FieldElementMock);
        expect(fieldElements.length).toEqual(4);

        let actualProps = fieldElements.at(0).props();
        expect(actualProps.isInvalid).toEqual(true);
        expect(actualProps.invalidMessage).toEqual(invalidMessage);
    });

    it('adds drop targets for each form element on touch devices', () => {
        const mockDevice = {isTouch() {return true;}};
        QbFormRewireAPI.__Rewire__('Device', mockDevice);
        // Remove dependencies on a drag/drop context for the purpose of this test
        QbFormRewireAPI.__Rewire__('MobileDropTarget', MobileDropTarget);
        QbFormRewireAPI.__Rewire__('DragAndDropField', fieldElement => fieldElement);

        component = mount(<QBForm activeTab="0" formData={fakeQbFormData} editingForm={true} />);

        let mobileDropTargets = component.find('.sectionColumn').first().find('.mobileDropTarget');
        expect(mobileDropTargets.length).toEqual(5);

        QbFormRewireAPI.__ResetDependency__('Device');
        QbFormRewireAPI.__ResetDependency__('MobileDropTarget');
        QbFormRewireAPI.__ResetDependency__('DragAndDropField');
    });
});
