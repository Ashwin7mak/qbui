import {referenceElement, relationships} from '../../src/mocks/relationship';

export const textElementText = 'Text element text';

// NOTE: All test data is exported in functions so that a fresh object is used in every test.
export function buildTestFormData() {
    return {
        formMeta: {
            formId: 1,
            tableId: 2,
            appId: 3,
            name: 'Test Form',
            tabs: {
                0: {
                    orderIndex: 0,
                    title: 'Tab1',
                    sections: {
                        0: {
                            orderIndex: 0,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab1-Section1',
                                    type: 'HEADER'
                                }
                            },
                            elements: {
                                0: {
                                    FormFieldElement: {
                                        displayText: 'Tab1-Section1-Field1',
                                        type: 'FIELD',
                                        orderIndex: 0,
                                        positionSameRow: false,
                                        fieldId: 6,
                                    }
                                },
                                1: {
                                    FormFieldElement: {
                                        displayText: 'Tab1-Section1-Field2',
                                        type: 'FIELD',
                                        orderIndex: 1,
                                        positionSameRow: false,
                                        fieldId: 7,
                                    }
                                },
                                2: {
                                    FormFieldElement: {
                                        displayText: 'Tab1-Section1-Field3',
                                        type: 'FIELD',
                                        orderIndex: 2,
                                        positionSameRow: false,
                                        fieldId: 8,
                                    }
                                },
                                3: {
                                    FormFieldElement: {
                                        displayText: 'Tab1-Section1-Field4',
                                        type: 'FIELD',
                                        orderIndex: 3,
                                        positionSameRow: false,
                                        fieldId: 9,
                                        showAsRadio: false
                                    }
                                },
                            },
                        },
                        1: {
                            orderIndex: 1,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab1-Section2',
                                    type: 'HEADER'
                                }
                            },
                            elements: {
                                0: {
                                    FormFieldElement: {
                                        displayText: 'Tab1-Section2-Field1',
                                        type: 'FIELD',
                                        orderIndex: 0,
                                        positionSameRow: false,
                                        fieldId: 11,
                                    }
                                },
                                1: {
                                    FormFieldElement: {
                                        displayText: 'Tab1-Section2-Field2',
                                        type: 'FIELD',
                                        orderIndex: 1,
                                        positionSameRow: false,
                                        fieldId: 12,
                                    }
                                },
                                2: {
                                    FormFieldElement: {
                                        displayText: 'Tab1-Section2-Field3',
                                        labelPosition: 'LEFT',
                                        type: "FIELD",
                                        orderIndex: 2,
                                        positionSameRow: false,
                                        fieldId: 13,
                                    }
                                },
                            }
                        }
                    },
                },

                1: {
                    orderIndex: 1,
                    title: 'Tab2',
                    sections: {
                        0: {
                            orderIndex: 0,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab2-Section1',
                                    type: 'HEADER'
                                }
                            },
                            elements: {
                                0: {
                                    FormFieldElement: {
                                        displayText: 'Tab2-Section1-Field1',
                                        type: 'FIELD',
                                        orderIndex: 0,
                                        positionSameRow: false,
                                        fieldId: 14,
                                    }
                                },
                                1: {
                                    FormFieldElement: {
                                        displayText: 'Tab2-Section1-Field2',
                                        type: 'FIELD',
                                        orderIndex: 1,
                                        positionSameRow: true,
                                        fieldId: 15,
                                    }
                                },
                                2: {
                                    FormFieldElement: {
                                        displayText: 'Tab2-Section1-Field3',
                                        type: "FIELD",
                                        orderIndex: 2,
                                        positionSameRow: false,
                                        fieldId: 16,
                                    }
                                },
                                3: {
                                    FormFieldElement: {
                                        displayText: 'Tab2-Section1-Field4',
                                        type: 'FIELD',
                                        orderIndex: 3,
                                        positionSameRow: true,
                                        fieldId: 17,
                                    }
                                },
                                4: {
                                    FormFieldElement: {
                                        displayText: 'Tab2-Section1-Field5',
                                        type: 'FIELD',
                                        orderIndex: 4,
                                        positionSameRow: true,
                                        fieldId: 18,
                                    }
                                },
                                5: {
                                    FormFieldElement: {
                                        displayText: 'Tab2-Section1-Field6',
                                        type: 'FIELD',
                                        orderIndex: 5,
                                        positionSameRow: false,
                                        fieldId: 19,
                                    }
                                },
                                6: {
                                    FormFieldElement: {
                                        displayText: 'Tab2-Section1-Field7',
                                        type: 'FIELD',
                                        orderIndex: 14,
                                        positionSameRow: false,
                                        fieldId: 20,
                                    }
                                },
                            }
                        }
                    }
                }
            },
        },
        record:[{id: 2, value: "field value"}],
        fields: [{id: 6, name: "field 6", datatypeAttributes: {type: "TEXT"}}, {id: 7, name: "field 7", datatypeAttributes: {type: "TEXT"}}]
    };
}

export function buildTestArrayBasedFormData() {
    return {
        formMeta: {
            formId: 1,
            tableId: 2,
            appId: 3,
            name: 'Test Form',
            tabs: [
                {
                    orderIndex: 0,
                    title: 'Tab1',
                    id: 'tab1',
                    sections: [
                        {
                            id: 'section1',
                            orderIndex: 0,
                            isEmpty: false,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab1-Section1',
                                    type: 'HEADER'
                                }
                            },
                            columns: [
                                {
                                    id: 'column-0',
                                    orderIndex: 0,
                                    elements: [
                                        {
                                            id: '6',
                                            orderIndex: 0,
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section1-Field1',
                                                type: 'FIELD',
                                                orderIndex: 0,
                                                positionSameRow: false,
                                                fieldId: 6,
                                            }
                                        },
                                        {
                                            id: '7',
                                            orderIndex: 1,
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section1-Field2',
                                                type: 'FIELD',
                                                orderIndex: 1,
                                                positionSameRow: false,
                                                fieldId: 7,
                                            }
                                        },
                                        {
                                            id: '8',
                                            orderIndex: 2,
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section1-Field3',
                                                type: 'FIELD',
                                                orderIndex: 2,
                                                positionSameRow: false,
                                                fieldId: 8,
                                            }
                                        },
                                        {
                                            id: '9',
                                            orderIndex: 3,
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section1-Field4',
                                                type: 'FIELD',
                                                orderIndex: 3,
                                                positionSameRow: false,
                                                fieldId: 9,
                                                showAsRadio: false
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            id: 'section2',
                            orderIndex: 1,
                            isEmpty: false,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab1-Section2',
                                    type: 'HEADER'
                                }
                            },
                            columns: [{
                                id: 'column-1',
                                orderIndex: 0,
                                elements: [
                                    {
                                        id: '11',
                                        orderIndex: 0,
                                        FormFieldElement: {
                                            displayText: 'Tab1-Section2-Field1',
                                            type: 'FIELD',
                                            orderIndex: 0,
                                            positionSameRow: false,
                                            fieldId: 11,
                                        }
                                    },
                                    {
                                        id: '12',
                                        orderIndex: 1,
                                        FormFieldElement: {
                                            displayText: 'Tab1-Section2-Field2',
                                            type: 'FIELD',
                                            orderIndex: 1,
                                            positionSameRow: false,
                                            fieldId: 12,
                                        }
                                    },
                                    {
                                        id: '13',
                                        orderIndex: 2,
                                        FormFieldElement: {
                                            displayText: 'Tab1-Section2-Field3',
                                            labelPosition: 'LEFT',
                                            type: "FIELD",
                                            orderIndex: 2,
                                            positionSameRow: false,
                                            fieldId: 13,
                                        }
                                    },
                                ]
                            }],
                        }
                    ]
                },

                {
                    id: 'tab2',
                    orderIndex: 1,
                    title: 'Tab2',
                    sections: [
                        {
                            id: 'section3',
                            orderIndex: 0,
                            isEmpty: false,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab2-Section1',
                                    type: 'HEADER'
                                }
                            },
                            columns: [
                                {
                                    id: 'column-3',
                                    orderIndex: 0,
                                    elements: [
                                        {
                                            id: '14',
                                            orderIndex: 0,
                                            FormFieldElement: {
                                                displayText: 'Tab2-Section1-Field1',
                                                type: 'FIELD',
                                                orderIndex: 0,
                                                positionSameRow: false,
                                                fieldId: 14,
                                            }
                                        },
                                        {
                                            id: '15',
                                            orderIndex: 1,
                                            FormFieldElement: {
                                                displayText: 'Tab2-Section1-Field2',
                                                type: 'FIELD',
                                                orderIndex: 1,
                                                positionSameRow: false,
                                                fieldId: 15,
                                            }
                                        },
                                        {
                                            id: '16',
                                            orderIndex: 2,
                                            FormFieldElement: {
                                                displayText: 'Tab2-Section1-Field3',
                                                type: "FIELD",
                                                orderIndex: 2,
                                                positionSameRow: false,
                                                fieldId: 16,
                                            }
                                        },
                                        {
                                            id: '17',
                                            orderIndex: 3,
                                            FormFieldElement: {
                                                displayText: 'Tab2-Section1-Field4',
                                                type: 'FIELD',
                                                orderIndex: 3,
                                                positionSameRow: false,
                                                fieldId: 17,
                                            }
                                        },
                                        {
                                            id: '18',
                                            orderIndex: 4,
                                            FormFieldElement: {
                                                displayText: 'Tab2-Section1-Field5',
                                                type: 'FIELD',
                                                orderIndex: 4,
                                                positionSameRow: false,
                                                fieldId: 18,
                                            }
                                        },
                                        {
                                            id: '19',
                                            orderIndex: 5,
                                            FormFieldElement: {
                                                displayText: 'Tab2-Section1-Field6',
                                                type: 'FIELD',
                                                orderIndex: 5,
                                                positionSameRow: false,
                                                fieldId: 19,
                                            }
                                        },
                                        {
                                            id: '20',
                                            orderIndex: 6,
                                            FormFieldElement: {
                                                displayText: 'Tab2-Section1-Field7',
                                                type: 'FIELD',
                                                orderIndex: 6,
                                                positionSameRow: false,
                                                fieldId: 20,
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            id: 'section4',
                            orderIndex: 1,
                            isEmpty: true,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab2-Section2',
                                    type: 'HEADER'
                                }
                            },
                            columns: [{
                                id: 'column-4',
                                orderIndex: 0,
                                elements: []
                            }]
                        },
                        {
                            id: 'section5',
                            orderIndex: 2,
                            isEmpty: true,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab2-Section3',
                                    type: 'HEADER'
                                }
                            },
                            columns: [{
                                id: 'column-4',
                                orderIndex: 0,
                                elements: [
                                    {
                                        id: '21',
                                        orderIndex: 0,
                                        FormFieldElement: {
                                            displayText: 'Tab2-Section5-Field8',
                                            type: 'FIELD',
                                            orderIndex: 15,
                                            positionSameRow: false,
                                            fieldId: 21,
                                        }
                                    },
                                    {
                                        id: '22',
                                        orderIndex: 1,
                                        FormFieldElement: {
                                            displayText: 'Tab2-Section5-Field9',
                                            type: 'FIELD',
                                            orderIndex: 16,
                                            positionSameRow: false,
                                            fieldId: 22,
                                        }
                                    },
                                ]
                            }]
                        },
                        {
                            id: 'section6',
                            orderIndex: 3,
                            isEmpty: true,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab2-Section3',
                                    type: 'HEADER'
                                }
                            },
                            columns: [{
                                id: 'column-4',
                                orderIndex: 0,
                                elements: [
                                    {
                                        id: '23',
                                        orderIndex: 0,
                                        FormTextElement: {
                                            displayText: textElementText,
                                            type: 'TEXT',
                                            orderIndex: 0,
                                            textType: 'RAW'
                                        }
                                    }
                                ]
                            }]
                        },
                    ]
                }
            ]
        },
        record:[{id: 2, value: "field value"}],
        fields: [{id: 6, name: "field 6", datatypeAttributes: {type: "TEXT"}}, {id: 7, name: "field 7", datatypeAttributes: {type: "TEXT"}}]
    };
}

export function buildTestFormDataArrayWithTwoColumns() {
    return {
        formMeta: {
            formId: 1,
            tableId: 2,
            appId: 3,
            name: 'Test Form',
            tabs: [
                {
                    orderIndex: 0,
                    title: 'Tab1',
                    id: 'tab1',
                    sections: [
                        {
                            id: 'section1',
                            orderIndex: 0,
                            isEmpty: false,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Tab1-Section1',
                                    type: 'HEADER'
                                }
                            },
                            columns: [
                                {
                                    id: 'column-0',
                                    orderIndex: 0,
                                    elements: [
                                        {
                                            id: '6',
                                            orderIndex: 0,
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section1-Field1',
                                                type: 'FIELD',
                                                orderIndex: 0,
                                                positionSameRow: false,
                                                fieldId: 6,
                                            }
                                        },
                                    ]
                                },
                                {
                                    id: 'column-1',
                                    orderIndex: 1,
                                    elements: [
                                        {
                                            id: '7',
                                            orderIndex: 0,
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section1-Field2',
                                                type: 'FIELD',
                                                orderIndex: 1,
                                                positionSameRow: false,
                                                fieldId: 7,
                                            }
                                        },
                                    ]
                                }
                            ]
                        },
                    ]
                },
            ]
        },
        record:[{id: 2, value: "field value"}],
        fields: [{id: 6, name: "field 6", datatypeAttributes: {type: "TEXT"}}, {id: 7, name: "field 7", datatypeAttributes: {type: "TEXT"}}]
    };
}

export function buildTestFormDataWithRelationship() {
    return {
        formMeta: {
            formId: 1,
            tableId: 2,
            appId: 3,
            name: 'Test Form',
            tabs: [
                {
                    orderIndex: 0,
                    title: 'Tab1',
                    id: 'tab1',
                    sections: [
                        {
                            id: 'section1',
                            orderIndex: 0,
                            isEmpty: false,
                            headerElement: {
                                FormHeaderElement: {
                                    displayText: 'Child report link',
                                    type: 'HEADER'
                                }
                            },
                            columns: [
                                {
                                    id: 'column-0',
                                    orderIndex: 0,
                                    elements: [
                                        referenceElement()
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ],
            relationships
        },
        record:[{id: 2, value: "field value"}],
        fields: [{id: 6, name: "field 6", datatypeAttributes: {type: "TEXT"}}, {id: 7, name: "field 7", datatypeAttributes: {type: "TEXT"}}],
    };
}

export default buildTestFormData;
