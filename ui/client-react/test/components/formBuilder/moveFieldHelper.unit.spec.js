import MoveFieldHelper from '../../../src/components/formBuilder/moveFieldHelper';
import {testArrayBasedFormData as testFormData} from '../../testHelpers/testFormData';

function buildDraggedItemProps(tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex, element) {
    return {
        location: {
            tabIndex,
            sectionIndex,
            columnIndex,
            rowIndex,
            elementIndex
        },
        element
    };
}

/**
 * A helper method to simplify the formMeta to get relevant data for an expectation
 * WARNING: It ignores rows. If testing row placement, avoid this helper.
 * @param formMeta
 * @param tabIndex
 * @param sectionIndex
 * @param columnIndex
 * @returns {Array}
 */
function getFieldsAndTheirIndex(formMeta, tabIndex, sectionIndex, columnIndex) {
    let rows = formMeta.tabs[tabIndex].sections[sectionIndex].columns[columnIndex].rows;

    let elements = [];

    rows.forEach(row => {
        let element = row.elements[0];
        elements.push({orderIndex: row.orderIndex, fieldId: element.FormFieldElement.fieldId});
    });

    return elements;
}

describe('MoveFieldHelper', () => {
    describe('moveField', () => {

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
                expectedResult: [
                    {orderIndex: 0, fieldId: 7},
                    {orderIndex: 1, fieldId: 6},
                    {orderIndex: 2, fieldId: 8},
                    {orderIndex: 3, fieldId: 9}
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
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                let originalElement = testFormData.formMeta.tabs[testCase.originalTab].sections[testCase.originalSection].columns[testCase.originalColumn].rows[testCase.originalRow].elements[testCase.originalElementIndex];
                let elementProps = buildDraggedItemProps(testCase.originalTab, testCase.originalSection, testCase.originalColumn, testCase.originalRow, testCase.originalElementIndex, originalElement);

                let result = MoveFieldHelper.moveField(testFormData.formMeta, testCase.newTab, testCase.newSection, testCase.newColumn, testCase.newRow, testCase.newElementIndex, elementProps);
                let simplifiedResult = getFieldsAndTheirIndex(result, testCase.newTab, testCase.newSection, testCase.newColumn);

                expect(simplifiedResult).toEqual(testCase.expectedResult);

                if (testCase.expectedOriginalLocationSimplifiedResult) {
                    // Expect the item to be removed from its original tab/section
                    let simplifiedResultForSecondTab = getFieldsAndTheirIndex(result, testCase.originalTab, testCase.originalSection, testCase.originalColumn);

                    expect(simplifiedResultForSecondTab).toEqual(testCase.expectedOriginalLocationSimplifiedResult);
                }
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
                MoveFieldHelper.moveField({}, 2, 3, 4, 5, 6, {});

                expect(errors.length).toEqual(1);
            });
        });

    });
});
