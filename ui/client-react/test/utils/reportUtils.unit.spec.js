import ReportUtils from '../../src/utils/reportUtils';

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
        {test:'valid input with group', input:'3:V.-4', output: ['3', '-4']}
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(ReportUtils.getSortFids(data.input)).toEqual(data.output);
        });
    });
});

describe('ReportUtils - test doesSortListIncludeGrouping', () => {
    var dataProvider = [
        {test:'empty input', input:'', output: false},
        {test:'null input', input:null, output: false},
        {test:'empty array input', input:[], output: false},
        {test:'non array input', input:'5', output: false},
        {test:'valid input', input:'3.-4', output: false},
        {test:'valid input 2', input:'3.-4', output: false},
        {test:'valid input with grouping', input:'3:V.-4:I', output: true},
        {test:'valid input with grouping 2', input:'3.-4:I', output: true}
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

describe('ReportUtils - test getSortStringFromList', () => {
    var dataProvider = [
        {test:'empty input', input:'', output: ''},
        {test:'null input', input:null, output: ''},
        {test:'valid input with sort', input:["3", "-4"], output: '3.-4'},
        {test:'valid input with group', input:["3", "-4:V"], output: '3.-4'},
    ];
    dataProvider.forEach(function(data) {
        it(data.test, function() {
            expect(ReportUtils.getSortStringFromSortListArray(data.input)).toBe(data.output);
        });
    });
});
