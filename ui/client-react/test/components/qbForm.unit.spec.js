import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import QBForm from '../../src/components/QBForm/qbform';
import QBPanel from '../../src/components/QBPanel/qbpanel.js';
import {TabPane} from 'rc-tabs';

const fakeQBFormData = {
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
                            "position": "LEFT",
                            "type": "HEADER"
                        }
                    },
                    "elements": {
                        "0": {
                            "FormTextElement": {
                                "displayText": "nVKDmsHNglesDRcAE4QoGKj6cd5UdfESolSBpZ31zGBcFsFHTY",
                                "displayOptions": [
                                    "ADD"
                                ],
                                "position": "ABOVE",
                                "type": "TEXT",
                                "orderIndex": 0,
                                "textType": "RAW"
                            }
                        }
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
                            "position": "ABOVE",
                            "type": "HEADER"
                        }
                    },
                    "elements": {
                        "0": {
                            "FormFieldElement": {
                                "displayText": "xIepCSrq8URUBZXa6ve6XP78JazogRQ0nFT5P8g7kFf176OzEj",
                                "displayOptions": [
                                    "ADD",
                                    "EDIT"
                                ],
                                "position": "ABOVE",
                                "type": "FIELD",
                                "orderIndex": 0,
                                "useAlternateLabel": false,
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
};

describe('QBForm functions', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<QBForm activeTab={"0"}></QBForm>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var qbForm = ReactDOM.findDOMNode(component);
        expect(qbForm).toBeDefined();
    });
});
