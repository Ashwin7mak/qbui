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
    }
};

export default testFormData;
