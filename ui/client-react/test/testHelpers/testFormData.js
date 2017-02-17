export const textElementText = 'Text element text';

const testFormData = {
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

export default testFormData;

export const testArrayBasedFormData = {
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
                        location: {tabIndex: 0, sectionIndex: 0},
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
                                rows: [
                                    {
                                        id: 'row-0',
                                        orderIndex: 0,
                                        elements: [
                                            {
                                                id: '6',
                                                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, rowIndex: 0, elementIndex: 0},
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
                                        id: 'row-1',
                                        orderIndex: 1,
                                        elements: [
                                            {
                                                id: '7',
                                                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, rowIndex: 1, elementIndex: 0},
                                                FormFieldElement: {
                                                    displayText: 'Tab1-Section1-Field2',
                                                    type: 'FIELD',
                                                    orderIndex: 1,
                                                    positionSameRow: false,
                                                    fieldId: 7,
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id: 'row-2',
                                        orderIndex: 2,
                                        elements: [
                                            {
                                                id: '8',
                                                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, rowIndex: 2, elementIndex: 0},
                                                FormFieldElement: {
                                                    displayText: 'Tab1-Section1-Field3',
                                                    type: 'FIELD',
                                                    orderIndex: 2,
                                                    positionSameRow: false,
                                                    fieldId: 8,
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id: 'row-3',
                                        orderIndex: 3,
                                        elements: [
                                            {
                                                id: '9',
                                                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, rowIndex: 3, elementIndex: 0},
                                                FormFieldElement: {
                                                    displayText: 'Tab1-Section1-Field4',
                                                    type: 'FIELD',
                                                    orderIndex: 3,
                                                    positionSameRow: false,
                                                    fieldId: 9,
                                                    showAsRadio: false
                                                }
                                            },
                                        ]
                                    },
                                ],
                            }
                        ]
                    },
                    {
                        id: 'section2',
                        orderIndex: 1,
                        location: {tabIndex: 0, sectionIndex: 1},
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
                            rows: [
                                {
                                    id: 'row-4',
                                    orderIndex: 0,
                                    elements: [
                                        {
                                            id: '11',
                                            location: {tabIndex: 0, sectionIndex: 1, columnIndex: 0, rowIndex: 0, elementIndex: 0},
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section2-Field1',
                                                type: 'FIELD',
                                                orderIndex: 0,
                                                positionSameRow: false,
                                                fieldId: 11,
                                            }
                                        },
                                    ]
                                },
                                {
                                    id: 'row-5',
                                    orderIndex: 1,
                                    elements: [
                                        {
                                            id: '12',
                                            location: {tabIndex: 0, sectionIndex: 1, columnIndex: 0, rowIndex: 1, elementIndex: 0},
                                            FormFieldElement: {
                                                displayText: 'Tab1-Section2-Field2',
                                                type: 'FIELD',
                                                orderIndex: 1,
                                                positionSameRow: false,
                                                fieldId: 12,
                                            }
                                        },
                                    ]
                                },
                                {
                                    id: 'row-6',
                                    orderIndex: 2,
                                    elements: [
                                        {
                                            id: '13',
                                            location: {tabIndex: 0, sectionIndex: 1, columnIndex: 0, rowIndex: 2, elementIndex: 0},
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
                        location: {tabIndex: 1, sectionIndex: 0},
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
                                rows: [
                                    {
                                        id: 'row-7',
                                        orderIndex: 0,
                                        elements: [
                                            {
                                                id: '14',
                                                location: {tabIndex: 1, sectionIndex: 0, columnIndex: 0, rowIndex: 0, elementIndex: 0},
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
                                                location: {tabIndex: 1, sectionIndex: 0, columnIndex: 0, rowIndex: 0, elementIndex: 1},
                                                FormFieldElement: {
                                                    displayText: 'Tab2-Section1-Field2',
                                                    type: 'FIELD',
                                                    orderIndex: 1,
                                                    positionSameRow: true,
                                                    fieldId: 15,
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id: 'row-8',
                                        orderIndex: 1,
                                        elements: [
                                            {
                                                id: '16',
                                                location: {tabIndex: 1, sectionIndex: 0, columnIndex: 0, rowIndex: 1, elementIndex: 0},
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
                                                location: {tabIndex: 1, sectionIndex: 0, columnIndex: 0, rowIndex: 1, elementIndex: 1},
                                                FormFieldElement: {
                                                    displayText: 'Tab2-Section1-Field4',
                                                    type: 'FIELD',
                                                    orderIndex: 3,
                                                    positionSameRow: true,
                                                    fieldId: 17,
                                                }
                                            },
                                            {
                                                id: '18',
                                                location: {tabIndex: 1, sectionIndex: 0, columnIndex: 0, rowIndex: 1, elementIndex: 2},
                                                FormFieldElement: {
                                                    displayText: 'Tab2-Section1-Field5',
                                                    type: 'FIELD',
                                                    orderIndex: 4,
                                                    positionSameRow: true,
                                                    fieldId: 18,
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id: 'row-9',
                                        orderIndex: 2,
                                        elements: [
                                            {
                                                id: '19',
                                                location: {tabIndex: 1, sectionIndex: 0, columnIndex: 0, rowIndex: 2, elementIndex: 0},
                                                FormFieldElement: {
                                                    displayText: 'Tab2-Section1-Field6',
                                                    type: 'FIELD',
                                                    orderIndex: 5,
                                                    positionSameRow: false,
                                                    fieldId: 19,
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        id: 'row-10',
                                        orderIndex: 3,
                                        elements: [

                                            {
                                                id: '20',
                                                location: {tabIndex: 1, sectionIndex: 0, columnIndex: 0, rowIndex: 3, elementIndex: 0},
                                                FormFieldElement: {
                                                    displayText: 'Tab2-Section1-Field7',
                                                    type: 'FIELD',
                                                    orderIndex: 14,
                                                    positionSameRow: false,
                                                    fieldId: 20,
                                                }
                                            },
                                        ]
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        id: 'section4',
                        orderIndex: 0,
                        location: {tabIndex: 1, sectionIndex: 0},
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
                            rows: []
                        }]
                    },
                    {
                        id: 'section5',
                        orderIndex: 0,
                        location: {tabIndex: 1, sectionIndex: 0},
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
                            rows: [
                                {
                                    id: 'row-11',
                                    orderIndex: 0,
                                    elements: [
                                        {
                                            id: '21',
                                            location: {
                                                tabIndex: 1,
                                                sectionIndex: 0,
                                                columnIndex: 0,
                                                rowIndex: 0,
                                                elementIndex: 0
                                            },
                                            FormTextElement: {
                                                displayText: textElementText,
                                                type: 'TEXT',
                                                orderIndex: 0,
                                                textType: 'RAW'
                                            }
                                        }
                                    ]
                                },
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

export const testFormDataArrayWithTwoColumns = {
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
                        location: {tabIndex: 0, sectionIndex: 0},
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
                                rows: [
                                    {
                                        id: 'row-0',
                                        orderIndex: 0,
                                        elements: [
                                            {
                                                id: '6',
                                                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, rowIndex: 0, elementIndex: 0},
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
                                ],
                            },
                            {
                                id: 'column-1',
                                orderIndex: 1,
                                rows: [
                                    {
                                        id: 'row-1',
                                        orderIndex: 1,
                                        elements: [
                                            {
                                                id: '7',
                                                location: {tabIndex: 0, sectionIndex: 0, columnIndex: 0, rowIndex: 1, elementIndex: 0},
                                                FormFieldElement: {
                                                    displayText: 'Tab1-Section1-Field2',
                                                    type: 'FIELD',
                                                    orderIndex: 1,
                                                    positionSameRow: false,
                                                    fieldId: 7,
                                                }
                                            },
                                        ]
                                    },
                                ],
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
