import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {ReportColumnHeaderMenu, __RewireAPI__ as ContainerRewireAPI} from '../../../src/components/dataTable/reportGrid/reportColumnHeaderMenu';
import * as FieldConsts from '../../../src/constants/schema';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const testPrependText = 'groupTest';
const MockLocale = {
    getMessage(messageKey) {return messageKey;}
};
const actions = {
    sortReport() {},
    groupReport() {}
};
const testFieldDef = {
    id: 13,
    datatypeAttributes: {type: FieldConsts.NUMERIC}
};

let component;
let instance;

describe('ReportColumnHeaderMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();

        ContainerRewireAPI.__Rewire__('Locale', MockLocale);
    });

    afterEach(() => {
        ContainerRewireAPI.__ResetDependency__('Locale');
    });

    describe('getSortAscText', () => {
        let testCases = [
            {
                description: 'returns a message for checkbox',
                type: FieldConsts.CHECKBOX,
                expectedValue: 'uncheckedToChecked'
            },
            {
                description: 'returns a message for text',
                type: FieldConsts.TEXT,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for Url',
                type: FieldConsts.URL,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for User',
                type: FieldConsts.USER,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for Email',
                type: FieldConsts.EMAIL_ADDRESS,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for Date',
                type: FieldConsts.DATE,
                expectedValue: 'oldToNew'
            },
            {
                description: 'returns a message for DateTime',
                type: FieldConsts.DATE_TIME,
                expectedValue: 'oldToNew'
            },
            {
                description: 'returns a message for Time',
                type: FieldConsts.TIME_OF_DAY,
                expectedValue: 'oldToNew'
            },
            {
                description: 'returns a message for Numeric',
                type: FieldConsts.NUMERIC,
                expectedValue: 'lowToHigh'
            },
            {
                description: 'returns a message for Rating',
                type: FieldConsts.RATING,
                expectedValue: 'lowToHigh'
            },
            {
                description: 'returns a default message for any other types',
                type: 'unknown',
                expectedValue: 'lowToHigh'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<ReportColumnHeaderMenu fieldDef={{datatypeAttributes: {type: testCase.type}}}/>);
                instance = component.instance();

                expect(instance.getSortAscText(testPrependText)).toEqual(`report.menu.${testPrependText}.${testCase.expectedValue}`);
            });
        });

        it('returns a blank string if no type is provided', () => {
            component = shallow(<ReportColumnHeaderMenu fieldDef={{datatypeAttributes: null}}/>);
            instance = component.instance();

            expect(instance.getSortAscText(testPrependText)).toEqual('');
        });
    });

    describe('getSortAscText', () => {
        let testCases = [
            {
                description: 'returns a message for checkbox',
                type: FieldConsts.CHECKBOX,
                expectedValue: 'uncheckedToChecked'
            },
            {
                description: 'returns a message for text',
                type: FieldConsts.TEXT,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for Url',
                type: FieldConsts.URL,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for User',
                type: FieldConsts.USER,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for Email',
                type: FieldConsts.EMAIL_ADDRESS,
                expectedValue: 'aToZ'
            },
            {
                description: 'returns a message for Date',
                type: FieldConsts.DATE,
                expectedValue: 'oldToNew'
            },
            {
                description: 'returns a message for DateTime',
                type: FieldConsts.DATE_TIME,
                expectedValue: 'oldToNew'
            },
            {
                description: 'returns a message for Time',
                type: FieldConsts.TIME_OF_DAY,
                expectedValue: 'oldToNew'
            },
            {
                description: 'returns a message for Numeric',
                type: FieldConsts.NUMERIC,
                expectedValue: 'lowToHigh'
            },
            {
                description: 'returns a message for Rating',
                type: FieldConsts.RATING,
                expectedValue: 'lowToHigh'
            },
            {
                description: 'returns a default message for any other types',
                type: 'unknown',
                expectedValue: 'lowToHigh'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<ReportColumnHeaderMenu fieldDef={{datatypeAttributes: {type: testCase.type}}}/>);
                instance = component.instance();

                expect(instance.getSortAscText(testPrependText)).toEqual(`report.menu.${testPrependText}.${testCase.expectedValue}`);
            });
        });

        it('returns a blank string if no type is provided', () => {
            component = shallow(<ReportColumnHeaderMenu fieldDef={{datatypeAttributes: null}}/>);
            instance = component.instance();

            expect(instance.getSortAscText(testPrependText)).toEqual('');
        });
    });

    describe('getSortDescText', () => {
        let testCases = [
            {
                description: 'returns a message for checkbox',
                type: FieldConsts.CHECKBOX,
                expectedValue: 'checkedToUnchecked'
            },
            {
                description: 'returns a message for text',
                type: FieldConsts.TEXT,
                expectedValue: 'zToA'
            },
            {
                description: 'returns a message for Url',
                type: FieldConsts.URL,
                expectedValue: 'zToA'
            },
            {
                description: 'returns a message for User',
                type: FieldConsts.USER,
                expectedValue: 'zToA'
            },
            {
                description: 'returns a message for Email',
                type: FieldConsts.EMAIL_ADDRESS,
                expectedValue: 'zToA'
            },
            {
                description: 'returns a message for Date',
                type: FieldConsts.DATE,
                expectedValue: 'newToOld'
            },
            {
                description: 'returns a message for DateTime',
                type: FieldConsts.DATE_TIME,
                expectedValue: 'newToOld'
            },
            {
                description: 'returns a message for Time',
                type: FieldConsts.TIME_OF_DAY,
                expectedValue: 'newToOld'
            },
            {
                description: 'returns a message for Numeric',
                type: FieldConsts.NUMERIC,
                expectedValue: 'highToLow'
            },
            {
                description: 'returns a message for Rating',
                type: FieldConsts.RATING,
                expectedValue: 'highToLow'
            },
            {
                description: 'returns a default message for any other types',
                type: 'unknown',
                expectedValue: 'highToLow'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<ReportColumnHeaderMenu fieldDef={{datatypeAttributes: {type: testCase.type}}}/>);
                instance = component.instance();

                expect(instance.getSortDescText(testPrependText)).toEqual(`report.menu.${testPrependText}.${testCase.expectedValue}`);
            });
        });

        it('returns a blank string if no type is provided', () => {
            component = shallow(<ReportColumnHeaderMenu fieldDef={{datatypeAttributes: null}}/>);
            instance = component.instance();

            expect(instance.getSortDescText(testPrependText)).toEqual('');
        });
    });

    describe('isFieldSorted', () => {
        let testCases = [
            {
                description: 'returns true if the field is included in the sort fids (ascending sort)',
                sortFids: [13],
                fieldId: 13,
                expectedValue: true
            },
            {
                description: 'returns true if the field is included in the sort fids (descending sort)',
                sortFids: [-13],
                fieldId: 13,
                expectedValue: true
            },
            {
                description: 'returns false if the field has not been sorted',
                sortFids: [2],
                fieldId: 13,
                expectedValue: false
            },
            {
                description: 'returns false if no fields have been sorted',
                sortFids: [],
                fieldId: 13,
                expectedValue: false
            },
            {
                description: 'returns false if sortFids prop is not passed in or is null',
                sortFids: null,
                fieldId: 13,
                expectedValue: false
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<ReportColumnHeaderMenu
                    sortFids={testCase.sortFids}
                    fieldDef={{id: testCase.fieldId}}
                />);
                instance = component.instance();

                if (testCase.expectedValue) {
                    expect(instance.isFieldSorted()).toBeTruthy();
                } else {
                    expect(instance.isFieldSorted()).toBeFalsy();
                }
            });
        });
    });

    describe('isSortedAsc', () => {
        let testCases = [
            {
                description: 'returns true if the field has been sorted in ascending order',
                sortFids: [13],
                fieldId: 13,
                expectedValue: true
            },
            {
                description: 'returns false has been sorted in descending order',
                sortFids: [-13],
                fieldId: 13,
                expectedValue: false
            },
            {
                description: 'returns false if the field has not been sorted',
                sortFids: [2],
                fieldId: 13,
                expectedValue: false
            },
            {
                description: 'returns false if no fields have been sorted',
                sortFids: [],
                fieldId: 13,
                expectedValue: false

            },
            {
                description: 'returns false if sortFids prop is not passed in or is null',
                sortFids: null,
                fieldId: 13,
                expectedValue: false
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<ReportColumnHeaderMenu
                    sortFids={testCase.sortFids}
                    fieldDef={{id: testCase.fieldId}}
                />);
                instance = component.instance();
                expect(instance.isSortedAsc()).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('Sort and Group', () => {
        // For these tests we check to make sure the appropriate action has been set on a menu item
        // and then make sure when that action is called, it calls the correct function passed in through props

        beforeEach(() => {
            Object.keys(actions).forEach(action => {
                spyOn(actions, action);
            });
        });


        it('sorts a field in ascending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...actions} fieldDef={testFieldDef}/>);
            instance = component.instance();

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.sortReportAscending});
            expect(sortingMenuItem).toBePresent();

            expect(sortingMenuItem.find('.sortAscendMenuText')).toHaveText('report.menu.sort.lowToHigh'); // Returns key because of mocked locale
            instance.sortReportAscending();

            expect(actions.sortReport).toHaveBeenCalledWith(testFieldDef, true, false);
        });


        it('sorts a field in descending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...actions} fieldDef={testFieldDef}/>);
            instance = component.instance();

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.sortReportDescending});
            expect(sortingMenuItem).toBePresent();

            expect(sortingMenuItem.find('.sortDescendMenuText')).toHaveText('report.menu.sort.highToLow'); // Returns key because of mocked locale
            instance.sortReportDescending();

            expect(actions.sortReport).toHaveBeenCalledWith(testFieldDef, false, false);
        });

        it('groups a field in ascending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...actions} fieldDef={testFieldDef}/>);
            instance = component.instance();

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.groupReportAscending});
            expect(sortingMenuItem).toBePresent();

            expect(sortingMenuItem.find('.groupAscendMenuText')).toHaveText('report.menu.group.lowToHigh'); // Returns key because of mocked locale
            instance.groupReportAscending();

            expect(actions.groupReport).toHaveBeenCalledWith(testFieldDef, true);
        });

        it('groups a field in descending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...actions} fieldDef={testFieldDef}/>);
            instance = component.instance();

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.groupReportDescending});
            expect(sortingMenuItem).toBePresent();

            expect(sortingMenuItem.find('.groupDescendMenuText')).toHaveText('report.menu.group.highToLow'); // Returns key because of mocked locale
            instance.groupReportDescending();

            expect(actions.groupReport).toHaveBeenCalledWith(testFieldDef, false);
        });
    });
});
