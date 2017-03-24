import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {ReportToolsAndContent,
        __RewireAPI__ as ReportToolsAndContentRewireAPI}  from '../../src/components/report/reportToolsAndContent';
import FacetSelections  from '../../src/components/facet/facetSelections';
import constants from '../../../common/src/constants';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {CONTEXT} from '../../src/actions/context';
import Promise from 'bluebird';
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
    let reportParams = {appId: 1, tblId: 2, rptId: rptId, format:true, offset: constants.PAGE.DEFAULT_OFFSET, numRows: constants.PAGE.DEFAULT_NUM_ROWS};
    let reportDataParams = {reportData: {appId: 1, tblId: 2, rptId: rptId, loading: true, selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}}};

    const primaryKeyName = 'Employee Number';
    const reportFields = [{
        appId: 1,
        tblId: 2,
        fields: {
            fields: {
                data: [
                    {
                        id: 3,
                        keyField: true,
                        name: primaryKeyName,
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
            }
        }
    }];

    const ReportContentMock = React.createClass({
        render() {
            return <div className="report-content-mock" />;
        }
    });

    beforeEach(() => {
        jasmineEnzyme();
        ReportToolsAndContentRewireAPI.__Rewire__('ReportContent', ReportContentMock);
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
        const reportParamsWithUndefinedAppId = Object.assign({}, reportParams, {appId: undefined});
        component = shallow(<ReportToolsAndContent flux={flux} params={reportParamsWithUndefinedAppId} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(component.find(ReportContentMock).length).toBe(1);
    });

    it('passes the primaryKeyName to child components', () => {
        const result = mount(
                <ReportToolsAndContent rptId={rptId} fields={reportFields} flux={flux} params={reportParams} {...reportDataParams}/>
            );

        const reportContent = result.find(ReportContentMock);

        expect(reportContent).toBeTruthy();
        expect(reportContent).toHaveProp('primaryKeyName', primaryKeyName);
    });



    describe('load dynamic report Action tests', () => {
        let loadDynamicReportSpy = null;
        beforeEach(() =>{
            loadDynamicReportSpy = jasmine.createSpy('loadDynamicReport');
        });

        it('invoke loadDynamicReport if a record is deleted', () => {

            let filter = {
                selections: reportDataParams.reportData.selections,
                search:undefined,
                facet:undefined
            };
            const queryParams = {
                sortList: '',
                offset: reportParams.offset,
                numRows: reportParams.numRows
            };

            const modifiedReport = Object.assign({}, reportDataParams);
            modifiedReport.reportData.isRecordDeleted = true;
            component = shallow(<ReportToolsAndContent loadDynamicReport={loadDynamicReportSpy} flux={flux}
                                                       params={reportParams} {...reportDataParams} {...modifiedReport} />);

            expect(loadDynamicReportSpy).toHaveBeenCalledWith(
                CONTEXT.REPORT.NAV,
                reportParams.appId,
                reportParams.tblId,
                reportParams.rptId,
                reportParams.format,
                filter,
                queryParams
            );

        });

        it('does not invoke loadDynamicReport if a record is not deleted', () => {

            const modifiedReport = Object.assign({}, reportDataParams);
            modifiedReport.reportData.isRecordDeleted = false;
            component = shallow(<ReportToolsAndContent loadDynamicReport={loadDynamicReportSpy} flux={flux} params={reportParams} {...reportDataParams} {...modifiedReport} />);

            expect(loadDynamicReportSpy).not.toHaveBeenCalled();
        });
    });


    describe('Search Input', () => {

        let searchInput = null;
        let clearSearchInput = null;
        let obj = {};
        const selectedAppId = 1;
        beforeEach(() => {

            searchInput = jasmine.createSpy('searchInput');
            clearSearchInput = jasmine.createSpy('clearSearchInput');
            obj = {
                loadDynamicReport: null
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
                    CONTEXT.REPORT.NAV,
                    reportParams.appId,
                    reportParams.tblId,
                    reportParams.rptId,
                    reportParams.format,
                    jasmine.any(Object),
                    jasmine.any(Object)
                );
                done();
            });
        });



        it('loads a new report with an empty search string when user clears search input', (done) => {
            new Promise(resolve => {
                // loadDynamicReport is called with a debounce, resolve when it's called
                spyOn(obj, 'loadDynamicReport').and.callFake(() => {
                    resolve();
                });
                // pass in the spy loadDynamicReport as a prop
                component.setProps({loadDynamicReport: obj.loadDynamicReport});
                component.instance().clearSearchString();
                expect(clearSearchInput).toHaveBeenCalled();
                expect(obj.loadDynamicReport).toHaveBeenCalled();
            }).then(() => {
                expect(obj.loadDynamicReport).toHaveBeenCalledWith(
                    CONTEXT.REPORT.NAV,
                    reportParams.appId,
                    reportParams.tblId,
                    reportParams.rptId,
                    reportParams.format,
                    jasmine.any(Object),
                    jasmine.any(Object)
                );
                done();
            });
        });
    });
});
