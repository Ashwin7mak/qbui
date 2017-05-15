import React from 'react';
import {UnconnectedReportToolsAndContent as ReportToolsAndContent,
        __RewireAPI__ as ReportToolsAndContentRewireAPI}  from '../../src/components/report/reportToolsAndContent';
import FacetSelections  from '../../src/components/facet/facetSelections';
import constants from '../../../common/src/constants';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {CONTEXT} from '../../src/actions/context';
import {DEFAULT_RECORD_KEY} from '../../src/constants/schema';
import Promise from 'bluebird';

class WindowHistoryMock {
    static pushWithQuery(key, recId) { }
}
describe('ReportToolsAndContent functions', () => {
    'use strict';

    let component;

    const flux = {
        actions:{
            selectTableId() {return;},
            loadReport() {return;},
            loadFields() {return;},
            hideTopNav() {return;},
            getFilteredRecords() {return;},
            filterSearchPending() {return;},
            filterSelectionsPending() {return;},
            getNextReportPage() {return;},
            getPreviousReportPage() {return;},
            getPageUsingOffsetMultiplicant() {return;},
            loadDynamicReport() {return;},
        }
    };

    const rptId = '3';
    let reportParams = {
        params: {appId: 1, tblId: 2, rptId: rptId, format:true, offset: constants.PAGE.DEFAULT_OFFSET, numRows: constants.PAGE.DEFAULT_NUM_ROWS}
    };
    let reportDataParams = {
        reportData: {
            appId: 1,
            tblId: 2,
            rptId: rptId,
            loading: true,
            pageOffset: 20,
            selections: new FacetSelections(),
            data: {
                recordsCount: 5,
                sortList: "1",
                columns: [{field: "col_num", headerName: "col_num"}],
                facets: [{
                    id: 1,
                    name: 'test',
                    type: "TEXT",
                    values: [{value: "a"}, {value: "b"}, {value: "c"}]
                }]
            }
        },
        selectedRows: ["rowSelected"]
    };

    const primaryKeyName = DEFAULT_RECORD_KEY;
    const fields = [{
        appId: 1,
        tblId: 2,
        keyField: {id:3, keyField:true},
        fields: [
            {
                id: 3,
                name: primaryKeyName
            },
            {
                id: 1,
                name: 'First Name'
            },
            {
                id: 2,
                name: 'Last Name'
            }
        ]
    }];

    const ReportContentMock = React.createClass({
        render() {
            return <div className="report-content-mock" />;
        }
    });

    beforeEach(() => {
        jasmineEnzyme();
        ReportToolsAndContentRewireAPI.__Rewire__('ReportContent', ReportContentMock);
        ReportToolsAndContentRewireAPI.__Rewire__('WindowHistoryUtils', WindowHistoryMock);
        spyOn(WindowHistoryMock, 'pushWithQuery').and.callThrough();
        spyOn(flux.actions, 'selectTableId');
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'loadFields');
        spyOn(flux.actions, 'hideTopNav');
        spyOn(flux.actions, 'getFilteredRecords');
        spyOn(flux.actions, 'filterSearchPending');
        spyOn(flux.actions, 'filterSelectionsPending');
        spyOn(flux.actions, 'getNextReportPage');
        spyOn(flux.actions, 'getPreviousReportPage');
    });

    afterEach(() => {
        ReportToolsAndContentRewireAPI.__ResetDependency__('ReportContent');
        WindowHistoryMock.pushWithQuery.calls.reset();
        flux.actions.selectTableId.calls.reset();
        flux.actions.loadReport.calls.reset();
        flux.actions.loadFields.calls.reset();
        flux.actions.hideTopNav.calls.reset();
        flux.actions.getFilteredRecords.calls.reset();
        flux.actions.filterSearchPending.calls.reset();
        flux.actions.filterSelectionsPending.calls.reset();
        flux.actions.getNextReportPage.calls.reset();
        flux.actions.getPreviousReportPage.calls.reset();
    });

    it('test render of report widget', () => {
        const div = document.createElement('div');
        component = shallow(<ReportToolsAndContent flux={flux} params={reportParams} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(component.find(ReportContentMock).length).toBe(1);
    });

    it('test report is not rendered with missing app data', () => {
        const div = document.createElement('div');
        const reportParamsWithUndefinedAppId = Object.assign({}, reportParams, {params: {appId: undefined}});
        component = shallow(<ReportToolsAndContent flux={flux} params={reportParamsWithUndefinedAppId} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(component.find(ReportContentMock).length).toBe(1);
    });

    it('passes the primaryKeyName to child components', () => {
        const result = shallow(
                <ReportToolsAndContent rptId={rptId} fields={fields} flux={flux} params={reportParams} {...reportDataParams}/>
            );

        const reportContent = result.find(ReportContentMock);

        expect(reportContent).toBePresent();
        expect(reportContent).toHaveProp('primaryKeyName', primaryKeyName);
    });

    it('invoke editNewRecord and verify pushWithQuery method gets called', () => {
        component = shallow(
            <ReportToolsAndContent
                flux={flux}
                params={reportParams}
                {...reportDataParams}
            />);
        component.instance().editNewRecord();
        expect(WindowHistoryMock.pushWithQuery).toHaveBeenCalled();
    });

    describe('load dynamic report Action tests', () => {
        let loadDynamicReportSpy = null;
        beforeEach(() =>{
            loadDynamicReportSpy = jasmine.createSpy('loadDynamicReport');
        });

        it('invoke loadDynamicReport if a record is deleted', () => {

            const modifiedReport = Object.assign({}, reportDataParams);
            modifiedReport.reportData.isRecordDeleted = true;
            component = shallow(<ReportToolsAndContent loadDynamicReport={loadDynamicReportSpy} flux={flux}
                                                       params={reportParams} {...reportDataParams} {...modifiedReport} />);

            expect(loadDynamicReportSpy).toHaveBeenCalledWith(
                reportParams.params.appId,
                reportParams.params.tblId,
                reportParams.params.rptId,
                reportParams.params.format,
                jasmine.any(Object),
                jasmine.any(Object)
            );

        });

        it('does not invoke loadDynamicReport if a record is not deleted', () => {

            const modifiedReport = Object.assign({}, reportDataParams);
            modifiedReport.reportData.isRecordDeleted = false;
            component = shallow(<ReportToolsAndContent loadDynamicReport={loadDynamicReportSpy} flux={flux} params={reportParams} {...reportDataParams} {...modifiedReport} />);

            expect(loadDynamicReportSpy).not.toHaveBeenCalled();
        });
    });


    describe('Test Search Input', () => {

        let searchInput = null;
        let clearSearchInput = null;
        let obj = {};
        const selectedAppId = 1;
        beforeEach(() => {

            searchInput = jasmine.createSpy('searchInput');
            clearSearchInput = jasmine.createSpy('clearSearchInput');
            obj = {
                loadDynamicReport() {}
            };
            component = shallow(
                <ReportToolsAndContent
                    searchInput={searchInput}
                    clearSearchInput={clearSearchInput} flux={flux}
                    params={reportParams}
                    selectedAppId={selectedAppId}
                    routeParams={{appId:1, tblId:2,  rptId:'3'}}
                    {...reportDataParams}
                />);
        });

        it('loads a new report with a debounce when user runs a text search', (done) => {
            new Promise(resolve => {
                // loadDynamicReport is called with a debounce, resolve when it's called
                spyOn(obj, 'loadDynamicReport').and.callFake(() => {
                    resolve();
                });
                // pass in the spy loadDynamicReport as a prop
                component.setProps({loadDynamicReport: obj.loadDynamicReport});
                component.instance().searchTheString('Search Text!');
                expect(searchInput).toHaveBeenCalledWith('Search Text!');
                expect(obj.loadDynamicReport).not.toHaveBeenCalled();
            }).then(() => {
                expect(obj.loadDynamicReport).toHaveBeenCalledWith(
                    reportParams.params.appId,
                    reportParams.params.tblId,
                    reportParams.params.rptId,
                    reportParams.params.format,
                    jasmine.any(Object),
                    jasmine.any(Object)
                );
                done();
            });
        });



        it('loads a new report with an empty search string when user clears search input', () => {
            // loadDynamicReport is called with a debounce, resolve when it's called
            spyOn(obj, 'loadDynamicReport');
            // pass in the spy loadDynamicReport as a prop
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            component.instance().clearSearchString();
            expect(clearSearchInput).toHaveBeenCalled();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
            expect(obj.loadDynamicReport).toHaveBeenCalledWith(
                reportParams.params.appId,
                reportParams.params.tblId,
                reportParams.params.rptId,
                reportParams.params.format,
                jasmine.any(Object),
                jasmine.any(Object)
            );
        });
    });

    describe('Test get report next page', () => {
        let obj = {};
        reportDataParams.reportData.pageOffset = constants.PAGE.DEFAULT_OFFSET;
        reportDataParams.reportData.numRows = constants.PAGE.DEFAULT_NUM_ROWS;
        beforeEach(() => {
            obj = {
                loadDynamicReport: null
            };
            component = shallow(
                <ReportToolsAndContent
                    flux={flux}
                    params={reportParams}
                    {...reportDataParams}
                />);

        });

        it('records count less than sum of offset and number of rows, method returns false', () => {
            const result =  component.instance().getNextReportPage();
            expect(result).toBeFalsy();
        });

        it('records count more than sum of offset and number of rows, invokes loadDynamicReport', () => {
            spyOn(obj, 'loadDynamicReport');
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            reportDataParams.reportData.data.recordsCount =  reportDataParams.reportData.data.recordsCount + constants.PAGE.DEFAULT_NUM_ROWS;
            component.instance().getNextReportPage();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
        });
    });

    describe('Test get report previous page', () => {
        let obj = {};

        beforeEach(() => {
            obj = {
                loadDynamicReport: null
            };

            component = shallow(
                <ReportToolsAndContent
                    flux={flux}
                    params={reportParams}
                    {...reportDataParams}
                />);

        });

        it('if page offset is zero, method returns false', () => {
            reportDataParams.reportData.pageOffset = constants.PAGE.DEFAULT_OFFSET;
            const result =  component.instance().getPreviousReportPage();
            expect(result).toBeFalsy();
        });


        it('if page offset is not zero, invokes loadDynamicReport', () => {
            reportDataParams.reportData.pageOffset = constants.PAGE.DEFAULT_NUM_ROWS;
            spyOn(obj, 'loadDynamicReport');
            component.setProps({loadDynamicReport: obj.loadDynamicReport});
            component.instance().getPreviousReportPage();
            expect(obj.loadDynamicReport).toHaveBeenCalled();
        });
    });
});
