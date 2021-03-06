import MoveFieldHelper from '../../../src/components/formBuilder/moveFieldHelper';
import {buildTestArrayBasedFormData} from '../../testHelpers/testFormData';
import _ from 'lodash';

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
function getFieldIdsAsIndexedArray(formMeta, tabIndex, sectionIndex, columnIndex) {
    let elements = formMeta.tabs[tabIndex].sections[sectionIndex].columns[columnIndex].elements;

    return elements.map(element => {
        return element.FormFieldElement.fieldId;
    });
}

describe('MoveFieldHelper', () => {
    describe('methods', () => {

        let moveFieldTestCases = [
            {
                description: 'moves a field down within the same section/column',
                originalTab: 0,
                originalSection: 0,
                originalColumn: 0,
                originalElementIndex: 0,
                newTab: 0,
                newSection: 0,
                newColumn: 0,
                newRow: 1,
                expectedRemoveFieldResult: 3,
                newElementIndex: 1,
                expectedResult: [
                    7,
                    6,
                    8,
                    9
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
                newRow: 1,
                expectedRemoveFieldResult: 3,
                newElementIndex: 1,
                expectedResult: [
                    6,
                    9,
                    7,
                    8
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
                newRow: 1,
                expectedRemoveFieldResult: 4,
                newElementIndex: 1,
                expectedResult: [
                    6,
                    11,
                    7,
                    8,
                    9
                ],
                expectedOriginalLocationSimplifiedResult: [
                    12,
                    13
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
                newRow: 1,
                expectedRemoveFieldResult: 4,
                newElementIndex: 1,
                expectedResult: [
                    6,
                    21,
                    7,
                    8,
                    9
                ],
                expectedOriginalLocationSimplifiedResult: [
                    22
                ]
            }
        ];

        let removeFieldTestCases = [
            {
                originalTab: 0,
                originalSection: 0,
                originalColumn: 0,
                originalElementIndex: 0,
                formMetaData: testFormData.formMeta.tabs[0].sections[0].columns[0].elements.length,
                expectedRemoveFieldResult: 3
            },
            {
                originalTab: 0,
                originalSection: 1,
                originalColumn: 0,
                originalElementIndex: 0,
                formMetaData: testFormData.formMeta.tabs[0].sections[1].columns[0].elements.length,
                expectedRemoveFieldResult: 2
            },
            {
                originalTab: 1,
                originalSection: 2,
                originalColumn: 0,
                originalElementIndex: 0,
                formMetaData: testFormData.formMeta.tabs[1].sections[2].columns[0].elements.length,
                expectedRemoveFieldResult: 1
            }
        ];

        removeFieldTestCases.forEach(testCase => {
            it(`removeField: The form has ${testCase.formMetaData} fields, one is removed, and only ${testCase.expectedRemoveFieldResult} remains`, () => {
                // These functions have side effects so we want to create a copy of the data fresh for each test
                let copyOfTestFormData = _.cloneDeep(testFormData);
                let originalElement = copyOfTestFormData.formMeta.tabs[testCase.originalTab].sections[testCase.originalSection].columns[testCase.originalColumn].elements[testCase.originalElementIndex];
                let elementProps = buildDraggedItemProps(testCase.originalTab, testCase.originalSection, testCase.originalColumn, testCase.originalElementIndex, originalElement, originalElement.FormFieldElement);

                let result = MoveFieldHelper.removeField(copyOfTestFormData.formMeta, elementProps.location);
                let simplifiedResult = getFieldIdsAsIndexedArray(result, testCase.originalTab, testCase.originalSection, testCase.originalColumn);

                expect(simplifiedResult.length).toEqual(testCase.expectedRemoveFieldResult);
            });
        });

        moveFieldTestCases.forEach(testCase => {
            it(`moveField: ${testCase.description}`, () => {
                // These functions have side effects so we want to create a copy of the data fresh for each test
                let copyOfTestFormData = _.cloneDeep(testFormData);
                let originalElement = copyOfTestFormData.formMeta.tabs[testCase.originalTab].sections[testCase.originalSection].columns[testCase.originalColumn].elements[testCase.originalElementIndex];
                let elementProps = buildDraggedItemProps(testCase.originalTab, testCase.originalSection, testCase.originalColumn, testCase.originalElementIndex, originalElement, originalElement.FormFieldElement);
                let newLocation = buildNewLocation(testCase.newTab, testCase.newSection, testCase.newColumn, testCase.newElementIndex);

                let result = MoveFieldHelper.moveField(copyOfTestFormData.formMeta, newLocation, elementProps);
                let simplifiedResult = getFieldIdsAsIndexedArray(result, testCase.newTab, testCase.newSection, testCase.newColumn);

                expect(simplifiedResult).toEqual(testCase.expectedResult);

                if (testCase.expectedOriginalLocationSimplifiedResult) {
                    // Expect the item to be removed from its original tab/section
                    let simplifiedResultForSecondTab = getFieldIdsAsIndexedArray(result, testCase.originalTab, testCase.originalSection, testCase.originalColumn);

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
                MoveFieldHelper.moveField({}, buildNewLocation(1, 2, 3, 4, 5), {});

                expect(errors.length).toEqual(1);
            });
        });

    });
});
