import ReportUtils from '../../src/utils/reportUtils';
import constants from '../../../common/src/constants';
import _ from 'lodash';

describe('ReportUtils', () => {
    describe('getSortList', () => {
        var dataProvider = [
            {test:'empty input', input:'', output: ''},
            {test:'null input', input:null, output: ''},
            {test:'empty array input', input:[], output: ''},
            {test:'valid input', input:[3, -4], output: '3.-4'},
            {test:'valid input', input:['3', '-4'], output: '3.-4'},
            {test:'valid input with grouping', input:['3:V', '-4:I'], output: '3:V.-4:I'}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getSortListString(data.input)).toBe(data.output);
            });
        });
    });

    describe('getFidList', () => {
        var dataProvider = [
            {test:'empty input', input:'', output: ''},
            {test:'null input', input:null, output: ''},
            {test:'empty array input', input:[], output: ''},
            {test:'valid input', input:[3, 4], output: '3.4'}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getFidListString(data.input)).toBe(data.output);
            });
        });
    });

    describe('getSortFids', () => {
        var dataProvider = [
            {test:'empty input', input:'', output: []},
            {test:'null input', input:null, output: []},
            {test:'valid input with sort', input:'3.-4', output: ['3', '-4']},
            {test:'valid input with group', input:'3:V.-4', output: ['3', '-4']},
            {test:'valid input with sort- integer array input', input:['3', '-4'], output: ['3', '-4']},
            {test:'valid input with group- integer array input', input:['3:V', '-4'], output: ['3', '-4']},
            {test:'valid input with sort- object array input', input:[{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: null}, {fieldId: '4', sortOrder: constants.SORT_ORDER.DESC, groupType: null}], output: ['3', '-4']},
            {test:'valid input with group- object array input', input:[{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: "V"}, {fieldId: '4', sortOrder: constants.SORT_ORDER.DESC, groupType: null}], output: ['3', '-4']}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getSortFids(data.input)).toEqual(data.output);
            });
        });
    });

    describe('getSortFidsOnly', () => {
        var dataProvider = [
            {test:'empty input', input:'', output: []},
            {test:'null input', input:null, output: []},
            {test:'valid input with sort- integer array input', input:['3', '-4'], output: ['3', '-4']},
            {test:'valid input with group- integer array input', input:['3:V', '-4'], output: ['-4']},
            {test:'valid input with sort and no group type - object array input', input:[{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: null}, {fieldId: '4', sortOrder: constants.SORT_ORDER.DESC, groupType: undefined}], output: ['3', '-4']},
            {test:'valid input with group- object array input', input:[{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: "V"}, {fieldId: '4', sortOrder: constants.SORT_ORDER.DESC, groupType: null}], output: ['-4']}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getSortFidsOnly(data.input)).toEqual(data.output);
            });
        });
    });

    describe('getGroupElements', () => {
        var dataProvider = [
            {test:'empty input', input:'', output: []},
            {test:'null input', input:null, output: []},
            {test:'valid input with sort', input:'3.-4', output: []},
            {test:'valid input with group', input:'3:V.-4', output: ['3:V']},
            {test:'valid input with sort- integer array input', input:['3', '-4'], output: []},
            {test:'valid input with group- negative integer array input', input:['-3:V', '-4'], output: ['-3:V']},
            {test:'valid input with sort- object array input', input:[{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: null}, {fieldId: '4', sortOrder: constants.SORT_ORDER.DESC, groupType: null}], output: []},
            {test:'valid input with group- object array input', input:[{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: "V"}, {fieldId: '4', sortOrder: constants.SORT_ORDER.DESC, groupType: null}], output: ['3:V']},
            {test:'valid input with desc sort- object array input', input:[{fieldId: '3', sortOrder: constants.SORT_ORDER.DESC, groupType: "V"}, {fieldId: '4', sortOrder: constants.SORT_ORDER.DESC, groupType: null}], output: ['-3:V']}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getGroupElements(data.input)).toEqual(data.output);
            });
        });
    });

    describe('doesSortListIncludeGrouping', () => {
        var dataProvider = [
            {test:'empty input', input:'', output: false},
            {test:'null input', input:null, output: false},
            {test:'empty array input', input:[], output: false},
            {test:'non array input', input:'5', output: false},
            {test:'valid input', input:'3', output: false},
            {test:'valid input with grouping', input:'3:V', output: true},
            {test:'valid input - object', input:{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: null}, output: false},
            {test:'valid input with group- object', input:{fieldId: '3', sortOrder: constants.SORT_ORDER.ASC, groupType: "V"}, output: true}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.hasGroupingFids(data.input)).toBe(data.output);
            });
        });
    });

    describe('appendSortFidToList', () => {
        var dataProvider = [
            {test:'empty input', sortList:'', sortFid:'', output:''},
            {test:'null sortList', sortList:null, sortFid:'', output: ''},
            {test:'null sortFid', sortList:'3.-4', sortFid:'', output: '3.-4'},
            {test:'null sortList non null sortFid', sortList:null, sortFid:'6', output: '6'},
            {test:'numeric sortFid', sortList:'3.-4', sortFid:6, output: '3.-4.6'},
            {test:'valid input with sort', sortList:'3.-4', sortFid:'6', output: '3.-4.6'},
            {test:'valid input with group', sortList:'3.-4', sortFid:'6:V', output: '3.-4.6:V'}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.appendSortFidToList(data.sortList, data.sortFid)).toBe(data.output);
            });
        });
    });

    describe('prependSortFidToList', () => {
        var dataProvider = [
            {test:'empty input', sortList:'', sortFid:'', output:''},
            {test:'null sortList', sortList:null, sortFid:'', output: null},
            {test:'null sortList non null sortFid', sortList:null, sortFid:'6', output: '6'},
            {test:'null sortFid', sortList:'3.-4', sortFid:'', output: '3.-4'},
            {test:'numeric sortFid', sortList:'3.-4', sortFid:6, output: '6.3.-4'},
            {test:'valid input with sort', sortList:'3.-4', sortFid:'6', output: '6.3.-4'},
            {test:'valid input with group', sortList:'3.-4', sortFid:'6:V', output: '6:V.3.-4'}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.prependSortFidToList(data.sortList, data.sortFid)).toBe(data.output);
            });
        });
    });

    describe('getGroupString', () => {
        var dataProvider = [
            {test:'empty input', fid:'', order: '', gtype: '', output: ''},
            {test:'null fid', fid:null, order: '', gtype: '', output: ''},
            {test:'null order', fid:1, order: null, gtype: '', output: '1'},
            {test:'null gtype', fid:1, order: '', gtype: null, output: '1'},
            {test:'valid fid no gtype', fid:2, order: true, gtype: '', output: '2'},
            {test:'valid input with gtype', fid:3, order: false, gtype: 'V', output: '-3:V'},
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getGroupString(data.fid, data.order, data.gtype)).toBe(data.output);
            });
        });
    });

    describe('getGListString', () => {
        var dataProvider = [
            {test:'empty input', sortFids:[], groupEls:[], output: ''},
            {test:'null sorfids', sortFids:null, groupEls:['3', '4'], output: '3.4'},
            {test:'null groupfids', sortFids:['3', '4'], groupEls:null, output: '3.4'},
            {test:'only sortfids', sortFids:['3', '4'], groupEls:[], output: '3.4'},
            {test:'only groupfids', sortFids:[], groupEls:['3', '4:V'], output: '3.4:V'},
            {test:'sort and groupfids', sortFids:['1', '2'], groupEls:['3', '4:V'], output: '3.4:V.1.2'}
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getGListString(data.sortFids, data.groupEls)).toBe(data.output);
            });
        });
    });

    describe('getSortListFromObject', () => {
        var dataProvider = [
            {test: 'empty input', sortList: [], output: ''},
            {test: 'null input', sortList: null, output: null},
            {test: 'non-array input', sortList: 'someString', output: 'someString'},
            {test: '1 sort only input', sortList: [{fieldId: 1, sortOrder: 'asc'}], output: '1'},
            {
                test: 'Multiple sort only input',
                sortList: [{fieldId: 1, sortOrder: 'asc'}, {fieldId: 2, sortOrder: 'desc'}],
                output: '1.-2'
            },
            {
                test: '1 group only input',
                sortList: [{fieldId: 1, sortOrder: 'asc', groupType: 'EQUALS'}],
                output: '1:EQUALS'
            },
            {
                test: 'Multiple sort and group input',
                sortList: [{fieldId: 1, sortOrder: 'asc'}, {fieldId: 2, sortOrder: 'desc', groupType: 'EQUALS'}],
                output: '1.-2:EQUALS'
            }
        ];
        dataProvider.forEach(function(data) {
            it(data.test, function() {
                expect(ReportUtils.getSortListFromObject(data.sortList)).toBe(data.output);
            });
        });
    });

    describe('findGroupedRecord', () => {

        let ungroupedReportData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {recId: {value:3}, data: 3}
        ];

        let groupedReportData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {children: [
                {recId: {value:3}, data: 3},
                {recId: {value:4}, data: 4}
            ]}
        ];

        // expected use
        it('finds recId in grouped report', () => {
            let rec = ReportUtils.findGroupedRecord(groupedReportData, 2, "recId");
            expect(rec).not.toEqual(null);
            expect(rec.data).toBe(2);

            // find nested record
            rec = ReportUtils.findGroupedRecord(groupedReportData, 3, "recId");
            expect(rec).not.toEqual(null);
            expect(rec.data).toBe(3);
        });

        // also works for ungrouped report
        it('finds recId in ungrouped report', () => {
            let rec = ReportUtils.findGroupedRecord(ungroupedReportData, 2, "recId");
            expect(rec).not.toEqual(null);
            expect(rec.data).toBe(2);
        });

        // returns null if record not found
        it('returns null if record not found', () => {

            // record not present
            let rec = ReportUtils.findGroupedRecord(groupedReportData, 999, "recId");
            expect(rec).toEqual(null);

            rec = ReportUtils.findGroupedRecord(ungroupedReportData, 999, "recId");
            expect(rec).toEqual(null);

            // record exists but key field incorrect
            rec = ReportUtils.findGroupedRecord(ungroupedReportData, 2, "recIdTYPO");
            expect(rec).toEqual(null);

            // no records, always return null
            rec = ReportUtils.findGroupedRecord([], 2, "recId");
            expect(rec).toEqual(null);

            rec = ReportUtils.findGroupedRecord({}, 2, "recId");
            expect(rec).toEqual(null);
        });
    });

    describe('findFirstGroupedRecord', () => {

        let ungroupedReportData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {recId: {value:3}, data: 3}
        ];

        let groupedReportData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {children: [
                {recId: {value:3}, data: 3},
                {recId: {value:4}, data: 4}
            ]}
        ];

        let nestedReportData = [
            {children: [
                {recId: {value:3}, data: 3},
                {recId: {value:4}, data: 4},
                {children: [
                    {recId: {value:5}, data: 5},
                    {recId: {value:6}, data: 6}
                ]}
            ]}
        ];
        // expected use
        it('finds first record in grouped report', () => {
            let rec = ReportUtils.findFirstGroupedRecord(groupedReportData);
            expect(rec).not.toEqual(null);
            expect(rec.data).toBe(1);
        });

        // also works for ungrouped report
        it('finds recId in ungrouped report', () => {
            let rec = ReportUtils.findFirstGroupedRecord(ungroupedReportData);
            expect(rec).not.toEqual(null);
            expect(rec.data).toBe(1);
        });

        it('finds first record in nested report', () => {
            let rec = ReportUtils.findFirstGroupedRecord(nestedReportData);
            expect(rec).not.toEqual(null);
            expect(rec.data).toBe(3);
        });


        // returns null if record not found
        it('returns null in case of empty records', () => {
            // no records, always return null
            let rec = ReportUtils.findFirstGroupedRecord([]);
            expect(rec).toEqual(null);
        });
    });


    describe('addGroupedRecordAfterRecId', () => {

        let ungroupedReportData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {recId: {value:3}, data: 3}
        ];

        let groupedReportData1 = [
            {children: [{recId: {value:1}, data: 1}]},
            {children: [{recId: {value:2}, data: 2}]},
            {children: [
                {recId: {value:3}, data: 3},
                {recId: {value:4}, data: 4}
            ]}
        ];
        let newRec = {data: 5};

        // expected use
        it('adds recId in nested grouped report', () => {
            let testData = groupedReportData1.slice();
            let result = ReportUtils.addGroupedRecordAfterRecId(testData, 3, "recId", newRec);
            expect(result).toEqual(true);
            expect(testData.length).toBe(3);
            expect(testData[2].children.length).toBe(3);
            expect(testData[2].children[1]).toBe(newRec);
        });

        // also works for ungrouped report
        it('adds recId in ungrouped report', () => {
            let testData = ungroupedReportData.slice();
            let result = ReportUtils.addGroupedRecordAfterRecId(testData, 2, "recId", newRec);
            expect(result).toEqual(true);
            expect(testData.length).toBe(4);
        });

        // returns null if record not found
        it('returns false if record not found', () => {
            // record not present
            let testData = groupedReportData1.slice();
            let result = ReportUtils.addGroupedRecordAfterRecId(testData, 999, "recId", newRec);
            expect(result).toEqual(false);

            testData = ungroupedReportData.slice();
            result = ReportUtils.addGroupedRecordAfterRecId(testData, 999, "recId", newRec);
            expect(result).toEqual(false);

            // record exists but key field incorrect
            testData = ungroupedReportData.slice();
            result = ReportUtils.addGroupedRecordAfterRecId(testData, 2, "recIdTYPO", newRec);
            expect(result).toEqual(false);

            // no records, always return null
            result = ReportUtils.addGroupedRecordAfterRecId([], 2, "recId", newRec);
            expect(result).toEqual(false);

            result = ReportUtils.addGroupedRecordAfterRecId({}, 2, "recId", newRec);
            expect(result).toEqual(false);
        });
    });

    describe('removeGroupedRecordById', () => {

        let ungroupedReportData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {recId: {value:3}, data: 3}
        ];

        let groupedReportData = [
            {children: [{recId: {value:1}, data: 1}]},
            {children: [{recId: {value:2}, data: 2}]},
            {children: [
                {recId: {value:3}, data: 3},
                {recId: {value:4}, data: 4}
            ]}
        ];
        // expected use
        it('removes recId in nested grouped report', () => {
            let testData = groupedReportData.slice();
            let result = ReportUtils.removeGroupedRecordById(testData, 3, "recId");
            expect(result).toEqual(true);
            expect(testData.length).toBe(3);
            expect(testData[2].children.length).toBe(1);
            expect(testData[2].children[0]).toEqual({recId: {value:4}, data: 4});
        });

        // also works for ungrouped report
        it('removes recId in ungrouped report', () => {
            let testData = ungroupedReportData.slice();
            let result = ReportUtils.removeGroupedRecordById(testData, 2, "recId");
            expect(result).toEqual(true);
            expect(testData.length).toBe(2);
        });

        // returns null if record not found
        it('returns false if record not found', () => {
            // record not present
            let testData = groupedReportData.slice();
            let result = ReportUtils.removeGroupedRecordById(testData, 999, "recId");
            expect(result).toEqual(false);

            testData = ungroupedReportData.slice();
            result = ReportUtils.removeGroupedRecordById(testData, 999, "recId");
            expect(result).toEqual(false);

            // record exists but key field incorrect
            testData = ungroupedReportData.slice();
            result = ReportUtils.removeGroupedRecordById(testData, 2, "recIdTYPO");
            expect(result).toEqual(false);

            // no records, always return null
            result = ReportUtils.removeGroupedRecordById([], 2, "recId");
            expect(result).toEqual(false);

            result = ReportUtils.removeGroupedRecordById({}, 2, "recId");
            expect(result).toEqual(false);
        });
    });

    describe('removeRecordFromArray', () => {

        let recordData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {recId: {value:3}, data: 3}
        ];

        // expected use
        it('removes recId in records', () => {
            let testData = recordData.slice();
            let result = ReportUtils.removeRecordFromArray(testData, 2, "recId");
            expect(result).toEqual([{recId: {value:2}, data: 2}]);
            expect(testData.length).toBe(2);
        });

        // returns null if record not found
        it('returns [] if record not found', () => {
            // record not present
            let testData = recordData.slice();
            let result = ReportUtils.removeRecordFromArray(testData, 999, "recId");
            expect(result).toEqual([]);

            // record exists but key field incorrect
            testData = recordData.slice();
            result = ReportUtils.removeRecordFromArray(testData, 2, "recIdTYPO");
            expect(result).toEqual([]);

            // no records, always return null
            result = ReportUtils.removeRecordFromArray([], 2, "recId");
            expect(result).toEqual([]);

            result = ReportUtils.removeRecordFromArray(null, 2, "recId");
            expect(result).toEqual([]);
        });
    });

    describe('findRecordIndex', () => {

        let recordData = [
            {recId: {value:1}, data: 1},
            {recId: {value:2}, data: 2},
            {recId: {value:3}, data: 3}
        ];

        // expected use
        it('finds recId in records', () => {
            let testData = recordData.slice();
            let result = ReportUtils.findRecordIndex(testData, 2, "recId");
            expect(result).toEqual(1);
        });

        // returns null if record not found
        it('returns -1 if record not found', () => {
            // record not present
            let testData = recordData.slice();
            let result = ReportUtils.findRecordIndex(testData, 999, "recId");
            expect(result).toEqual(-1);

            // record exists but key field incorrect
            testData = recordData.slice();
            result = ReportUtils.findRecordIndex(testData, 2, "recIdTYPO");
            expect(result).toEqual(-1);

            // no records, always return null
            result = ReportUtils.findRecordIndex([], 2, "recId");
            expect(result).toEqual(-1);

            result = ReportUtils.findRecordIndex(null, 2, "recId");
            expect(result).toEqual(-1);
        });
    });

    describe('areAllRowsSelected', () => {
        it('throws an error if non-transformed (grouped) are passed in', () => {
            let testRows = [{id: 1, name: 'test group', group: ['row1', 'row2']}];

            expect(() => {ReportUtils.areAllRowsSelected(testRows);}).toThrow(new Error('Transform rows to a flat array before passing determining if all rows are selected.'));
        });

        it('returns true if all rows are selected', () => {
            let testRows = [{id: 1}, {id: 2}, {id: 3}];
            let selectedRows = [1, 2, 3];

            expect(ReportUtils.areAllRowsSelected(testRows, selectedRows)).toBeTruthy();
        });

        it('returns false if not all rows are selected', () => {
            let testRows = [{id: 1}, {id: 2}, {id: 3}];
            let selectedRows = [1, 3];

            expect(ReportUtils.areAllRowsSelected(testRows, selectedRows)).toBeFalsy();
        });
    });
});
