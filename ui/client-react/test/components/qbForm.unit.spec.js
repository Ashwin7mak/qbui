import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import QBForm from '../../src/components/QBForm/qbform';
import QBPanel from '../../src/components/QBPanel/qbpanel.js';
import {TabPane} from 'rc-tabs';
import Breakpoints from '../../src/utils/breakpoints';

const fakeQBFormData = {
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
                                "labelPosition": "ABOVE",
                                "type": "HEADER"
                            }
                        },
                        "elements": {
                            "0": {
                                "FormTextElement": {
                                    "displayText": "Some Text",
                                    "displayOptions": [
                                        "ADD"
                                    ],
                                    "labelPosition": "ABOVE",
                                    "type": "TEXT",
                                    "orderIndex": 0,
                                    "textType": "RAW"
                                }
                            },
                            "1": {
                                "FormTextElement": {
                                    "displayText": "More Text on new line",
                                    "displayOptions": [
                                        "ADD"
                                    ],
                                    "labelPosition": "ABOVE",
                                    "type": "TEXT",
                                    "orderIndex": 0,
                                    "textType": "RAW"
                                }
                            },
                            "2": {
                                "FormTextElement": {
                                    "displayText": "More Text on same line",
                                    "displayOptions": [
                                        "ADD"
                                    ],
                                    "labelPosition": "ABOVE",
                                    "positionSameRow": true,
                                    "type": "TEXT",
                                    "orderIndex": 0,
                                    "textType": "RAW"
                                }
                            },

                        }
                    },
                    "1": {
                        "orderIndex": 1,
                        "headerElement": {
                            "FormHeaderElement": {
                                "displayText": "y0PJyN2isHoeynP4XnggiboW3ZmWJ3suFHOEYhOboRGOtMQUSD",
                                "displayOptions": [
                                    "ADD",
                                    "EDIT",
                                    "VIEW"
                                ],
                                "labelPosition": "LEFT",
                                "type": "HEADER"
                            }
                        },
                        "elements": {
                            "0": {
                                "FormFieldElement": {
                                    "useAlternateLabel": true,
                                    "displayText": "xIepCSrq8URUBZXa6ve6XP78JazogRQ0nFT5P8g7kFf176OzEj",
                                    "displayOptions": [
                                        "ADD",
                                        "EDIT"
                                    ],
                                    "labelPosition": "LEFT",
                                    "type": "FIELD",
                                    "orderIndex": 0,
                                    "readOnly": false,
                                    "required": false,
                                    "fieldId": 6,
                                    "fieldLabel": "testLabel2",
                                    "fieldValue": 123,
                                    "fieldType": "NUMERIC"
                                }
                            },
                            "1": {
                                "FormFieldElement": {
                                    "useAlternateLabel": false,
                                    "displayText": "Use this text instead",
                                    "displayOptions": [
                                        "ADD",
                                        "EDIT"
                                    ],
                                    "labelPosition": "LEFT",
                                    "type": "FIELD",
                                    "orderIndex": 0,
                                    "readOnly": false,
                                    "required": false,
                                    "fieldId": 2,
                                    "fieldLabel": "testLabel2",
                                    "fieldValue": 123,
                                    "fieldType": "NUMERIC"
                                }
                            }
                        }
                    }
                }
            },
            "1": {
                "orderIndex": 1,
                "title": "tab1",
            }
        }
    },
    record:[{id:2, value: "field value"}],
    fields: [{id: 6, name: "field 6", datatypeAttributes: {type: "TEXT"}}, {id: 2, name: "field 2", datatypeAttributes: {type: "TEXT"}}]
};

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
    record:[{id:2, value: "field value"}],
    fields: [{id: 2, name: "field name", datatypeAttributes: {type: "TEXT"}}]
};

var FieldElementMock = React.createClass({
    render: function() {
        return (
            <div className="formElement field">{this.props.display}</div>
        );
    }
});


class BreakpointsAlwaysSmallMock {

    static isSmallBreakpoint() {
        return true;
    }
}

describe('QBForm functions', () => {
    'use strict';

    let component;

    beforeEach(() => {
        QBForm.__Rewire__('FieldElement', FieldElementMock);
    });

    afterEach(() => {
        QBForm.__ResetDependency__('FieldElement');
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"}></QBForm>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const qbForm = ReactDOM.findDOMNode(component);
        expect(qbForm).toBeDefined();
    });

    it('test render of tabs', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={fakeQBFormData}></QBForm>);
        const tabs = TestUtils.scryRenderedComponentsWithType(component, TabPane);
        expect(tabs.length).toEqual(2);
    });

    it('test render of sections', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={fakeQBFormData}></QBForm>);
        const sections = TestUtils.scryRenderedDOMComponentsWithClass(component, "formSection");
        expect(sections.length).toEqual(2);
    });

    it('test render of formElements with labels on left', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={fakeQBFormData}></QBForm>);
        const fieldElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement field");
        expect(fieldElements.length).toEqual(2);

        const fieldLabelElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement fieldLabel");
        expect(fieldLabelElements.length).toEqual(2);
    });

    it('test render of formElements with single column due to small breakpoint', () => {

        QBForm.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);

        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={fakeQBFormData}></QBForm>);
        const fieldElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement field");
        expect(fieldElements.length).toEqual(2);

        const fieldLabelElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement fieldLabel");
        expect(fieldLabelElements.length).toEqual(0); // labels will be rendered as a part of FieldElement so none should show up for this case

        QBForm.__ResetDependency__('Breakpoints');
    });

    it('test render of text form elements', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={fakeQBFormData}></QBForm>);
        const textElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement text");
        expect(textElements.length).toEqual(2);
    });


    it('test render of empty section', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={emptyQBFormData}></QBForm>);
        const fieldElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement");
        expect(fieldElements.length).toEqual(0);
    });

    it('test render of form with unauthorized error status', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} errorStatus={403} formData={fakeQBFormData}></QBForm>);
        const fieldElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement field");
        expect(fieldElements.length).toEqual(0);

        const errorSection = TestUtils.scryRenderedDOMComponentsWithClass(component, "errorSection");
        expect(errorSection.length).toEqual(1);
    });

    it('test render of form with misc error status', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} errorStatus={500} formData={fakeQBFormData}></QBForm>);
        const fieldElements = TestUtils.scryRenderedDOMComponentsWithClass(component, "formElement field");
        expect(fieldElements.length).toEqual(0);

        const errorSection = TestUtils.scryRenderedDOMComponentsWithClass(component, "errorSection");
        expect(errorSection.length).toEqual(1);
    });

    it('test render of form field element with data from pendingEdits', () => {
        let edits = {
            recordChanges: {
                6: {
                    fieldName: "test",
                    newVal: {value: "value", display: "display"}
                }
            }
        };
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={fakeQBFormData} pendEdits={edits}></QBForm>);
        const fieldElements = TestUtils.scryRenderedComponentsWithType(component, FieldElementMock);
        expect(fieldElements.length).toEqual(2);
        expect(fieldElements[0].props.fieldRecord.display).toEqual("display");
        expect(fieldElements[0].props.fieldRecord.value).toEqual("value");
    });

    it('test render of form field element with editErrors', () => {
        let edits = {
            recordChanges: {
                6: {
                    fieldName: "test",
                    newVal: {value: "value", display: "display"}
                }
            },
            editErrors: {
                6: {
                    isInvalid: true,
                    invalidMessage: "invalid"
                }
            }
        };
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"} formData={fakeQBFormData} pendEdits={edits}></QBForm>);
        const fieldElements = TestUtils.scryRenderedComponentsWithType(component, FieldElementMock);
        expect(fieldElements.length).toEqual(2);
        expect(fieldElements[0].props.isInvalid).toEqual(true);
        expect(fieldElements[0].props.invalidMessage).toEqual("invalid");
    });
});
