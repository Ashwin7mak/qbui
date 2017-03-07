import MoveFieldHelper from '../../../src/components/formBuilder/moveFieldHelper';
import {testArrayBasedFormData as testFormData} from '../../testHelpers/testFormData';

function buildDraggedItemProps(tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex, containingElement, element) {
    return {
        location: {
            tabIndex,
            sectionIndex,
            columnIndex,
            rowIndex,
            elementIndex
        },
        containingElement,
        element
    };
}

function buildNewLocation(tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex) {
    return {
        tabIndex,
        sectionIndex,
        columnIndex,
        rowIndex,
        elementIndex
    };
}

/**
 * A helper method to simplify the formMeta to get relevant data for an expectation
 * WARNING: If a row index is provided, it will only return elements with that row. Otherwise, it ignores rows
 * and returns a list of all elements in the column.
 * @param formMeta
 * @param tabIndex
 * @param sectionIndex
 * @param columnIndex
 * @returns {Array}
 */
function getFieldsAndTheirIndex(formMeta, tabIndex, sectionIndex, columnIndex, rowIndex = null) {
    let rows = formMeta.tabs[tabIndex].sections[sectionIndex].columns[columnIndex].rows;

    let elements = [];

    if (rowIndex) {
        rows[rowIndex].elements.forEach(element => {
            elements.push({orderIndex: element.orderIndex, fieldId: element.FormFieldElement.fieldId});
        });
    } else {
        rows.forEach(row => {
            let element = row.elements[0];
            elements.push({orderIndex: row.orderIndex, fieldId: element.FormFieldElement.fieldId});
        });
    }

    return elements;
}

fdescribe('MoveFieldHelper', () => {
    describe('methods', () => {

        let testCases = [
            {
                description: 'moves a field down within the same section/column',
                originalTab: 0,
                originalSection: 0,
                originalColumn: 0,
                originalRow: 0,
                originalElementIndex: 0,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newRow: 1,
                newElementIndex: 0,
                expectedRemoveFieldResult: 3,
                expectedResult: [
                    {orderIndex: 0, fieldId: 7},
                    {orderIndex: 1, fieldId: 6},
                    {orderIndex: 2, fieldId: 8},
                    {orderIndex: 3, fieldId: 9},
                ],
                expectFieldToBeRemoved: false
            },
            {
                description: 'moves a field up within the same section/column',
                originalTab: 0,
                originalSection: 0,
                originalColumn: 0,
                originalRow: 3,
                originalElementIndex: 0,
                fieldId: 9,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newRow: 1,
                newElementIndex: 0,
                expectedRemoveFieldResult: 3,

                expectedResult: [
                    {orderIndex: 0, fieldId: 6},
                    {orderIndex: 1, fieldId: 9},
                    {orderIndex: 2, fieldId: 7},
                    {orderIndex: 3, fieldId: 8}
                ],
                expectFieldToBeRemoved: false
            },
            {
                description: 'moves a field across sections within a tab',
                originalTab: 0,
                originalSection: 1,
                originalColumn: 0,
                originalRow: 0,
                originalElementIndex: 0,
                fieldId: 11,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newRow: 1,
                newElementIndex: 0,
                expectedRemoveFieldResult: 4,
                expectedResult: [
                    {orderIndex: 0, fieldId: 6},
                    {orderIndex: 1, fieldId: 11},
                    {orderIndex: 2, fieldId: 7},
                    {orderIndex: 3, fieldId: 8},
                    {orderIndex: 4, fieldId: 9}
                ],
                expectedOriginalLocationSimplifiedResult: [
                    {orderIndex: 0, fieldId: 12},
                    {orderIndex: 1, fieldId: 13}
                ]
            },
            {
                description: 'moves a field across sections in different tabs',
                originalTab: 1,
                originalSection: 2,
                originalColumn: 0,
                originalRow: 0,
                originalElementIndex: 0,
                fieldId: 21,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newRow: 1,
                newElementIndex: 0,
                expectedRemoveFieldResult: 4,
                expectedResult: [
                    {orderIndex: 0, fieldId: 6},
                    {orderIndex: 1, fieldId: 21},
                    {orderIndex: 2, fieldId: 7},
                    {orderIndex: 3, fieldId: 8},
                    {orderIndex: 4, fieldId: 9}
                ],
                expectedOriginalLocationSimplifiedResult: [
                    {orderIndex: 0, fieldId: 22},
                ]
            },
            {
                description: 'moves a field to the left within a row',
                originalTab: 1,
                originalSection: 0,
                originalColumn: 0,
                originalRow: 1,
                originalElementIndex: 2,
                fieldId: 18,
                newTab: 1,
                newSection: 0,
                newColumn: 0,
                newRow: 1,
                newElementIndex: 1,
                checkRow: 1,
                expectedRemoveFieldResult: 2,
                expectedResult: [
                    {orderIndex: 0, fieldId: 16},
                    {orderIndex: 1, fieldId: 18},
                    {orderIndex: 2, fieldId: 17},
                ]
            },
            {
                description: 'moves a field to the right within a row',
                originalTab: 1,
                originalSection: 0,
                originalColumn: 0,
                originalRow: 1,
                originalElementIndex: 0,
                fieldId: 16,
                newTab: 1,
                newSection: 0,
                newColumn: 0,
                newRow: 1,
                newElementIndex: 1,
                checkRow: 1,
                expectedRemoveFieldResult: 2,
                expectedResult: [
                    {orderIndex: 0, fieldId: 17},
                    {orderIndex: 1, fieldId: 16},
                    {orderIndex: 2, fieldId: 18},
                ]
            }
        ];

        testCases.forEach(testCase => {
            fit(`moveField: ${testCase.description}`, () => {
                let originalElement = testFormData.formMeta.tabs[testCase.originalTab].sections[testCase.originalSection].columns[testCase.originalColumn].rows[testCase.originalRow].elements[testCase.originalElementIndex];
                let elementProps = buildDraggedItemProps(testCase.originalTab, testCase.originalSection, testCase.originalColumn, testCase.originalRow, testCase.originalElementIndex, originalElement, originalElement.FormFieldElement);
                let newLocation = buildNewLocation(testCase.newTab, testCase.newSection, testCase.newColumn, testCase.newRow, testCase.newElementIndex);

                let result = MoveFieldHelper.moveField(testFormData.formMeta, newLocation, elementProps);
                let simplifiedResult = getFieldsAndTheirIndex(result, testCase.newTab, testCase.newSection, testCase.newColumn, testCase.checkRow);

                expect(simplifiedResult).toEqual(testCase.expectedResult);

                if (testCase.expectedOriginalLocationSimplifiedResult) {
                    // Expect the item to be removed from its original tab/section
                    let simplifiedResultForSecondTab = getFieldsAndTheirIndex(result, testCase.originalTab, testCase.originalSection, testCase.originalColumn);

                    expect(simplifiedResultForSecondTab).toEqual(testCase.expectedOriginalLocationSimplifiedResult);
                }
            });

            fit(`removeField: The form has ${testCase.expectedResult.length} fields, one is removed, and only ${testCase.expectedRemoveFieldResult} remains`, () => {
                let originalElement = testFormData.formMeta.tabs[testCase.originalTab].sections[testCase.originalSection].columns[testCase.originalColumn].rows[testCase.originalRow].elements[testCase.originalElementIndex];
                let elementProps = buildDraggedItemProps(testCase.originalTab, testCase.originalSection, testCase.originalColumn, testCase.originalRow, testCase.originalElementIndex, originalElement, originalElement.FormFieldElement);

                let result = MoveFieldHelper.removeField(testFormData.formMeta, elementProps.location);
                let simplifiedResult = getFieldsAndTheirIndex(result, testCase.newTab, testCase.newSection, testCase.newColumn, testCase.checkRow);

                expect(simplifiedResult.length).toEqual(testCase.expectedRemoveFieldResult);
            });
        });

        describe('check for missing arguments', () => {
            let errors = [];
            class mockLogger {
                error(message) {
                    errors.push(message);
                }
            }

            beforeEach(() => {
                errors = [];
                MoveFieldHelper.__Rewire__('Logger', mockLogger);
            });

            afterEach(() => {
                MoveFieldHelper.__ResetDependency__('Logger');
            });

            it('logs errors if the required arguments are not passed in', () => {
                MoveFieldHelper.moveField();

                expect(errors.length).toEqual(3);
            });

            it('returns errors if the draggedItemProps is missing required properties', () => {
                MoveFieldHelper.moveField({}, buildNewLocation(1, 2, 3, 4, 5), {});

                expect(errors.length).toEqual(1);
            });
        });

    });
});
