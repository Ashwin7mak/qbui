import ReportUtils from '../../src/utils/reportUtils';
import constants from '../../../common/src/constants';

describe('ReportUtils - test getSortList', () => {
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

describe('ReportUtils - test getFidList', () => {
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

describe('ReportUtils - test getSortFids', () => {
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

describe('ReportUtils - test getSortFidsOnly', () => {
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

describe('ReportUtils - test getGroupElements', () => {
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

describe('ReportUtils - test doesSortListIncludeGrouping', () => {
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

describe('ReportUtils - test appendSortFidToList', () => {
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

describe('ReportUtils - test prependSortFidToList', () => {
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

describe('ReportUtils - test getGroupString', () => {
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

describe('ReportUtils - test getGListString', () => {
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

describe('ReportUtils - test getSortListFromObject', () => {
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

describe('ReportUtils - test findGroupedRecord', () => {

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
