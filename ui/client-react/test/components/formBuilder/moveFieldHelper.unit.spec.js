import MoveFieldHelper from '../../../src/components/formBuilder/moveFieldHelper';
import {buildTestArrayBasedFormData} from '../../testHelpers/testFormData';

const testFormData = buildTestArrayBasedFormData();

function buildDraggedItemProps(tabIndex, sectionIndex, columnIndex, elementIndex, containingElement, element) {
    return {
        location: {
            tabIndex,
            sectionIndex,
            columnIndex,
            elementIndex
        },
        containingElement,
        element
    };
}

function buildNewLocation(tabIndex, sectionIndex, columnIndex, elementIndex) {
    return {
        tabIndex,
        sectionIndex,
        columnIndex,
        elementIndex
    };
}

/**
 * A helper method to simplify the formMeta to get relevant data for an expectation
 * @param formMeta
 * @param tabIndex
 * @param sectionIndex
 * @param columnIndex
 * @returns {Array}
 */
function getFieldsAndTheirIndex(formMeta, tabIndex, sectionIndex, columnIndex) {
    let elements = formMeta.tabs[tabIndex].sections[sectionIndex].columns[columnIndex].elements;

    return elements.map(element => {
        return {orderIndex: element.orderIndex, fieldId: element.FormFieldElement.fieldId};
    });
}

describe('MoveFieldHelper', () => {
    describe('moveField', () => {

        let testCases = [
            {
                description: 'moves a field down within the same section/column',
                originalTab: 0,
                originalSection: 0,
                originalColumn: 0,
                originalElementIndex: 0,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newElementIndex: 1,
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
                originalElementIndex: 3,
                fieldId: 9,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newElementIndex: 1,
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
                originalElementIndex: 0,
                fieldId: 11,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newElementIndex: 1,
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
                originalElementIndex: 0,
                fieldId: 21,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newElementIndex: 1,
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
                let originalElement = testFormData.formMeta.tabs[testCase.originalTab].sections[testCase.originalSection].columns[testCase.originalColumn].elements[testCase.originalElementIndex];
                let elementProps = buildDraggedItemProps(testCase.originalTab, testCase.originalSection, testCase.originalColumn, testCase.originalElementIndex, originalElement, originalElement.FormFieldElement);
                let newLocation = buildNewLocation(testCase.newTab, testCase.newSection, testCase.newColumn, testCase.newElementIndex);

                let result = MoveFieldHelper.moveField(testFormData.formMeta, newLocation, elementProps);
                // let simplifiedResult = getFieldsAndTheirIndex(result, testCase.newTab, testCase.newSection, testCase.newColumn);

                // expect(simplifiedResult).toEqual(testCase.expectedResult);

                // if (testCase.expectedOriginalLocationSimplifiedResult) {
                    // Expect the item to be removed from its original tab/section
                    // let simplifiedResultForSecondTab = getFieldsAndTheirIndex(result, testCase.originalTab, testCase.originalSection, testCase.originalColumn);

                    // expect(simplifiedResultForSecondTab).toEqual(testCase.expectedOriginalLocationSimplifiedResult);
                // }
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
