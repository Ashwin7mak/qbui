import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {ReportColumnHeaderMenu, __RewireAPI__ as RewireAPI} from '../../../src/components/dataTable/reportGrid/reportColumnHeaderMenu';
import * as FieldConsts from '../../../src/constants/schema';
import * as query from '../../../src/constants/query';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {CONTEXT} from '../../../src/actions/context';
import serverTypeConstants from '../../../../common/src/constants';

const testPrependText = 'groupTest';
const MockLocale = {
    getMessage(messageKey) {return messageKey;}
};
const testFieldDef = {
    id: 13,
    datatypeAttributes: {type: FieldConsts.NUMERIC}
};
const testProps = {
    appId: 1,
    tblId: 2,
    rptId: 3,
    filter: "somefilter",
    fieldDef: testFieldDef,
    sortFids: [],
    isOnlyOneColumnVisible: false,
    inBuilderMode: false,
    loadDynamicReport: (context, appId, tblId, rptId, queryParams) => {},
    hideColumn: (context, appId, tblId, rptId, params) => {}
};
let component;
let instance;
describe('ReportColumnHeaderMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        RewireAPI.__Rewire__('Locale', MockLocale);
        spyOn(testProps, 'loadDynamicReport').and.callThrough();
        spyOn(testProps, 'hideColumn').and.callThrough();
    });

    afterEach(() => {
        RewireAPI.__ResetDependency__('Locale');
        testProps.loadDynamicReport.calls.reset();
        testProps.hideColumn.calls.reset();
    });

    describe('hasRequiredIds', () => {
        it('returns true if the appropriate props have been passed in to be able to call sort, group, and hide actions', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            expect(instance.hasRequiredIds()).toBeTruthy();
        });

        it('returns false if the required props to call sort, group, and hide actions are missing', () => {
            component = shallow(<ReportColumnHeaderMenu/>);
            instance = component.instance();

            expect(instance.hasRequiredIds()).toBeFalsy();
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
        it('sorts a field in ascending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.sortReportAscending});
            expect(sortingMenuItem).toBePresent();

            spyOn(instance, "sortReport");

            expect(sortingMenuItem.find('.sortAscendMenuText')).toHaveText('report.menu.sort.lowToHigh'); // Returns key because of mocked locale
            instance.sortReportAscending();

            expect(instance.sortReport).toHaveBeenCalledWith(true);
        });


        it('sorts a field in descending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.sortReportDescending});
            expect(sortingMenuItem).toBePresent();

            spyOn(instance, "sortReport");

            expect(sortingMenuItem.find('.sortDescendMenuText')).toHaveText('report.menu.sort.highToLow'); // Returns key because of mocked locale
            instance.sortReportDescending();

            expect(instance.sortReport).toHaveBeenCalledWith(false);
        });

        it('calls loadDynamicReport to sort a report', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            instance.sortReport(true, false);

            let expectedQueryParams = {};
            expectedQueryParams[query.SORT_LIST_PARAM] = '13';
            expectedQueryParams[query.OFFSET_PARAM] = serverTypeConstants.PAGE.DEFAULT_OFFSET;
            expectedQueryParams[query.NUMROWS_PARAM] = serverTypeConstants.PAGE.DEFAULT_NUM_ROWS;

            expect(testProps.loadDynamicReport).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, testProps.appId, testProps.tblId, testProps.rptId, true, testProps.filter, expectedQueryParams);
        });

        it('does not call the group action if the required props are not passed in', () => {
            component = shallow(<ReportColumnHeaderMenu />);
            instance = component.instance();

            instance.groupReport(true, false);

            expect(testProps.loadDynamicReport).not.toHaveBeenCalled();
        });

        it('groups a field in ascending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            spyOn(instance, "groupReport");

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.groupReportAscending});
            expect(sortingMenuItem).toBePresent();

            expect(sortingMenuItem.find('.groupAscendMenuText')).toHaveText('report.menu.group.lowToHigh'); // Returns key because of mocked locale
            instance.groupReportAscending();

            expect(instance.groupReport).toHaveBeenCalledWith(true);
        });

        it('groups a field in descending order when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            spyOn(instance, "groupReport");

            let sortingMenuItem = component.find(MenuItem).find({onSelect: instance.groupReportDescending});
            expect(sortingMenuItem).toBePresent();

            expect(sortingMenuItem.find('.groupDescendMenuText')).toHaveText('report.menu.group.highToLow'); // Returns key because of mocked locale
            instance.groupReportDescending();

            expect(instance.groupReport).toHaveBeenCalledWith(false);
        });

        it('calls loadDynamicReport to group a report', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            instance.groupReport(true);

            let expectedQueryParams = {};
            expectedQueryParams[query.SORT_LIST_PARAM] = '13:EQUALS';
            expectedQueryParams[query.OFFSET_PARAM] = serverTypeConstants.PAGE.DEFAULT_OFFSET;
            expectedQueryParams[query.NUMROWS_PARAM] = serverTypeConstants.PAGE.DEFAULT_NUM_ROWS;

            expect(testProps.loadDynamicReport).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, testProps.appId, testProps.tblId, testProps.rptId, true, testProps.filter, expectedQueryParams);
        });

        it('does not call the group action if the required props are not passed in', () => {
            component = shallow(<ReportColumnHeaderMenu />);
            instance = component.instance();

            instance.groupReport(true);

            expect(testProps.loadDynamicReport).not.toHaveBeenCalled();
        });
    });

    describe('Add and Hide', () => {
        it('hides a column when that menu item is selected', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();
            inBuilderMode = true;

            let hidingMenuItem = component.find(MenuItem).find({onSelect: instance.hideThisColumn});
            expect(hidingMenuItem).toBePresent();

            spyOn(instance, "hideThisColumn");

            expect(hidingMenuItem.find('.hideColumnText')).toHaveText('report.menu.hideColumn');
            instance.hideThisColumn();

            expect(instance.hideThisColumn).toHaveBeenCalled();
        });

        it('calls hideColumn to hide a field', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps}/>);
            instance = component.instance();

            instance.hideThisColumn(testProps.fieldDef.id);

            let params = {
                columnId: testProps.fieldDef.id
            };

            expect(testProps.hideColumn).toHaveBeenCalledWith(CONTEXT.REPORT.NAV, testProps.appId, testProps.tblId, testProps.rptId, params);
        });

        it('does not call the action to hide a column if the required props are not passed in', () => {
            component = shallow(<ReportColumnHeaderMenu isOnlyOneColumnVisible={false}/>);
            instance = component.instance();

            instance.hideThisColumn(testProps.fieldDef.id);

            expect(testProps.hideColumn).not.toHaveBeenCalled();
        });

        it('does not call the action to hide a column if there is only one column currently visible', () => {
            component = shallow(<ReportColumnHeaderMenu {...testProps} isOnlyOneColumnVisible={true}/>);
            instance = component.instance();

            instance.hideThisColumn(testProps.fieldDef.id);

            expect(testProps.hideColumn).not.toHaveBeenCalled();
        });
    });
});
