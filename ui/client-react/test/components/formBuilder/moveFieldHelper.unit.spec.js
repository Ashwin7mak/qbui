import MoveFieldHelper from '../../../src/components/formBuilder/moveFieldHelper';

// Helper variables to more easily find Ids in the formData
const firstTab = 0;
const firstSection = 0;
const firstFieldId = 6;
const firstFieldIndex = 0;
const secondFieldId = 7;
const secondFieldIndex = 1;
const thirdFieldId = 8;
const thirdFieldIndex = 2;
const fourthFieldId = 9;
const fourthFieldIndex = 3;
const fieldIdInDifferentSection = 10;
const fieldIndexInDifferentSection = 0;
const fieldIdInDifferentTab = 13;
const fieldIndexInDifferentTab = 0;
const secondSection = 1;
const secondTab = 1;

const testFormData = {
    formId: 1,
    appId: 'app1',
    tableId: 'table1',
    name: 'Form name',
    description: 'Form description',
    wrapLabel: true,
    includeBuiltIns: false,
    wrapElements: true,
    newFieldAction: "DO_NOTHING",
    tabs: {
        [firstTab]: {
            orderIndex: 0,
            title: 'Tab 1',
            sections: {
                [firstSection]: {
                    orderIndex: firstSection,
                    headerElement: {
                        FormHeaderElement: {
                            displayText: 'Section Header 1',
                            displayOptions: [
                                'ADD',
                                'VIEW',
                                'EDIT'
                            ],
                            labelPosition: 'LEFT',
                            type: 'HEADER'
                        }
                    },
                    elements: {
                        [firstFieldIndex]: {
                            FormFieldElement: {
                                displayText: 'Section 1 Field 1',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: firstFieldIndex,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: false,
                                fieldId: firstFieldId,
                                showAsRadio: false
                            }
                        },
                        [secondFieldIndex]: {
                            FormFieldElement: {
                                displayText: 'Section 1 Field 2',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: secondFieldIndex,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: true,
                                fieldId: secondFieldId,
                                showAsRadio: false
                            }
                        },
                        [thirdFieldIndex]: {
                            FormFieldElement: {
                                displayText: 'Section 1 Field 3',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: thirdFieldIndex,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: false,
                                fieldId: thirdFieldId,
                                showAsRadio: false
                            }
                        },
                        [fourthFieldIndex]: {
                            FormFieldElement: {
                                displayText: 'Section 1 Field 4',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: fourthFieldIndex,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: true,
                                fieldId: fourthFieldId,
                                showAsRadio: false
                            }
                        },
                    },
                    "fields": [
                        firstFieldId,
                        secondFieldId,
                        thirdFieldId,
                        fourthFieldId
                    ],
                    "pseudo": true
                },
                [secondSection]: {
                    orderIndex: secondSection,
                    headerElement: {
                        FormHeaderElement: {
                            displayText: 'Section Header 2',
                            displayOptions: [
                                'ADD',
                                'VIEW',
                                'EDIT'
                            ],
                            labelPosition: 'LEFT',
                            type: 'HEADER'
                        }
                    },
                    elements: {
                        [fieldIndexInDifferentSection]: {
                            FormFieldElement: {
                                displayText: 'Section 2 Field 1',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: fieldIndexInDifferentSection,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: false,
                                fieldId: fieldIdInDifferentSection,
                                showAsRadio: false
                            }
                        },
                        1: {
                            FormFieldElement: {
                                displayText: 'Section 2 Field 2',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: 1,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: true,
                                fieldId: 7,
                                showAsRadio: false
                            }
                        },
                        2: {
                            FormFieldElement: {
                                displayText: 'Section 1 Field 3',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: 2,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: false,
                                fieldId: 11,
                                showAsRadio: false
                            }
                        },
                        3: {
                            FormFieldElement: {
                                displayText: 'Section 1 Field 4',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: 3,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: true,
                                fieldId: 12,
                                showAsRadio: false
                            }
                        },
                    },
                    "fields": [
                        fieldIdInDifferentSection,
                        11,
                        12
                    ],
                    "pseudo": true
                }
            },
            "fields": [
                6,
                7,
                8,
                9,
                10,
                11,
                12
            ]
        },
        [secondTab]: {
            orderIndex: 0,
            title: 'Tab 1',
            sections: {
                [firstSection]: {
                    orderIndex: firstSection,
                    headerElement: {
                        FormHeaderElement: {
                            displayText: 'Tab 2 Section Header 1',
                            displayOptions: [
                                'ADD',
                                'VIEW',
                                'EDIT'
                            ],
                            labelPosition: 'LEFT',
                            type: 'HEADER'
                        }
                    },
                    elements: {
                        [fieldIndexInDifferentTab]: {
                            FormFieldElement: {
                                displayText: 'Tab 2 Section 1 Field 1',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: fieldIndexInDifferentTab,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: false,
                                fieldId: fieldIdInDifferentTab,
                                showAsRadio: false
                            }
                        },
                        1: {
                            FormFieldElement: {
                                displayText: 'Tab 2 Section 1 Field 2',
                                displayOptions: [
                                    'ADD',
                                    'VIEW',
                                    'EDIT'
                                ],
                                labelPosition: 'LEFT',
                                type: 'FIELD',
                                orderIndex: 1,
                                positionSameRow: false,
                                useAlternateLabel: false,
                                readOnly: false,
                                required: false,
                                fieldId: 14,
                                showAsRadio: false
                            }
                        }
                    },
                    "fields": [
                        fieldIdInDifferentTab,
                        14
                    ],
                    "pseudo": true
                }
            },
            "fields": [
                fieldIdInDifferentTab,
                14
            ]
        }
    },
};

function buildDraggedItemProps(tabIndex, sectionIndex, orderIndex, fieldId) {
    return {
        tabIndex,
        sectionIndex,
        orderIndex,
        element: {
            displayText: 'Moved Field',
            displayOptions: [
                'ADD',
                'VIEW',
                'EDIT'
            ],
            labelPosition: 'LEFT',
            type: 'FIELD',
            orderIndex: orderIndex,
            positionSameRow: false,
            useAlternateLabel: false,
            readOnly: false,
            required: false,
            fieldId: fieldId,
            showAsRadio: false
        }
    };
}

/**
 * A helper method to simplify the formMeta to get relevant data for an expectation
 * @param formData
 * @param tabIndex
 * @param sectionIndex
 * @returns {Array}
 */
function getFieldsAndTheirIndex(formData, tabIndex, sectionIndex) {
    let result = [];
    let elements = formData.tabs[tabIndex].sections[sectionIndex].elements;

    Object.keys(elements).forEach(key => {
        let element = elements[key].FormFieldElement;
        result.push({orderIndex: element.orderIndex, fieldId: element.fieldId});
    });

    return result;
}

describe('MoveFieldHelper', () => {
    describe('moveField', () => {

        let testCases = [
            {
                description: 'moves a field down within the same section',
                originalTab: firstTab,
                originalSection: firstSection,
                originalIndex: firstFieldIndex,
                fieldId: firstFieldId,
                newTab: firstTab,
                newSection: firstSection,
                newIndex: thirdFieldIndex,
                expectedResult: [
                    {orderIndex: 0, fieldId: secondFieldId},
                    {orderIndex: 1, fieldId: firstFieldId},
                    {orderIndex: 2, fieldId: thirdFieldId},
                    {orderIndex: 3, fieldId: fourthFieldId}
                ],
                expectFieldToBeRemoved: false
            },
            {
                description: 'moves a field up within the same section',
                originalTab: firstTab,
                originalSection: firstSection,
                originalIndex: fourthFieldIndex,
                fieldId: fourthFieldId,
                newTab: firstTab,
                newSection: firstSection,
                newIndex: secondFieldIndex,
                expectedResult: [
                    {orderIndex: 0, fieldId: firstFieldId},
                    {orderIndex: 1, fieldId: fourthFieldId},
                    {orderIndex: 2, fieldId: secondFieldId},
                    {orderIndex: 3, fieldId: thirdFieldId}
                ],
                expectFieldToBeRemoved: false
            },
            {
                description: 'moves a field across sections within a tab',
                originalTab: firstTab,
                originalSection: secondSection,
                originalIndex: fieldIndexInDifferentSection,
                fieldId: fieldIdInDifferentSection,
                newTab: firstTab,
                newSection: firstSection,
                newIndex: secondFieldIndex,
                expectedResult: [
                    {orderIndex: 0, fieldId: firstFieldId},
                    {orderIndex: 1, fieldId: fieldIdInDifferentSection},
                    {orderIndex: 2, fieldId: secondFieldId},
                    {orderIndex: 3, fieldId: thirdFieldId},
                    {orderIndex: 4, fieldId: fourthFieldId}
                ],
                expectFieldToBeRemoved: true
            },
            {
                description: 'moves a field across sections within a tab',
                originalTab: secondTab,
                originalSection: firstSection,
                originalIndex: fieldIndexInDifferentTab,
                fieldId: fieldIdInDifferentTab,
                newTab: firstTab,
                newSection: firstSection,
                newIndex: secondFieldIndex,
                expectedResult: [
                    {orderIndex: 0, fieldId: firstFieldId},
                    {orderIndex: 1, fieldId: fieldIdInDifferentTab},
                    {orderIndex: 2, fieldId: secondFieldId},
                    {orderIndex: 3, fieldId: thirdFieldId},
                    {orderIndex: 4, fieldId: fourthFieldId}
                ],
                expectFieldToBeRemoved: true
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let elementProps = buildDraggedItemProps(testCase.originalTab, testCase.originalSection, testCase.originalIndex, testCase.fieldId);

                let result = MoveFieldHelper.moveField(testFormData, testCase.newTab, testCase.newSection, testCase.newIndex, elementProps);
                let simplifiedResult = getFieldsAndTheirIndex(result, testCase.newTab, testCase.newSection);

                expect(simplifiedResult).toEqual(testCase.expectedResult);

                if (testCase.expectFieldToBeRemoved) {
                    let simplifiedResultForSecondTab = getFieldsAndTheirIndex(result, testCase.originalTab, testCase.originalSection);
                    // Expect the item to be removed from its original tab/section
                    expect(simplifiedResultForSecondTab).not.toContain({orderIndex: testCase.originalIndex, fieldId: testCase.fieldId});
                    // Makes sure the indexes of the original tab/section were updated now that the item was removed
                    expect(result.tabs[testCase.originalTab].sections[testCase.originalSection].elements[testCase.originalIndex])
                        .toEqual({FormFieldElement: Object.assign({}, testFormData.tabs[testCase.originalTab].sections[testCase.originalSection].elements[testCase.originalIndex + 1].FormFieldElement, {orderIndex: testCase.originalIndex})});
                }
            });
        });
    });
});
