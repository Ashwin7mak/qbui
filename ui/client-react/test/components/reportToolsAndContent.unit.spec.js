import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportToolsAndContent  from '../../src/components/report/reportToolsAndContent';
import FacetSelections  from '../../src/components/facet/facetSelections';

import Locale from '../../src/locales/locales';
var i18n = Locale.getI18nBundle();

describe('ReportToolsAndContent functions', () => {
    'use strict';

    let component;
    // function getFlux() {return {actions: {loadDynamicReport() {return;}}};}
    let flux = {
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
            // successfulDelete() {return;}
        }
    };

    let reportParams = {appId:1, tblId:2, rptId:3, format:true, offset:0, numRows: 20};
    let reportDataParams = {reportData: {loading:true, selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}}};

    let ReportContentMock = React.createClass({
        render() {
            return <div className="report-content-mock" />;
        }
    });

    beforeEach(() => {
        ReportToolsAndContent.__Rewire__('ReportContent', ReportContentMock);
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
        ReportToolsAndContent.__ResetDependency__('ReportContent');
        flux.actions.selectTableId.calls.reset();
        flux.actions.loadReport.calls.reset();
        flux.actions.loadFields.calls.reset();
        flux.actions.hideTopNav.calls.reset();
        flux.actions.getFilteredRecords.calls.reset();
        flux.actions.filterSearchPending.calls.reset();
        flux.actions.filterSelectionsPending.calls.reset();
        flux.actions.getNextReportPage.calls.reset();
        flux.actions.getPreviousReportPage.calls.reset();
        // flux.actions.getPageUsingOffsetMultiplicant.calls.reset();
        // flux.actions.loadDynamicReport.calls.reset();
        // flux.actions.successfulDelete.calls.reset();
    });

    it('test render of report widget', () => {
        var div = document.createElement('div');
        component = ReactDOM.render(<ReportToolsAndContent flux={flux} params={reportParams} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(1);
    });

    it('test report is not rendered with missing app data', () => {
        var div = document.createElement('div');
        reportParams.appId = undefined;
        component = ReactDOM.render(<ReportToolsAndContent flux={flux} params={reportParams} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(0);
    });

    it('test to check if page fetches records on successful delete', () => {
        let filter = {
            selections: reportDataParams.reportData.selections,
            search:undefined,
            facet:undefined
        };
        let queryParams = {
            sortList: '',
            offset: reportParams.offset,
            numRows: reportParams.numRows
        };
        let MockParent = React.createClass({
            getInitialState() {
                return {
                    isRecordDeleted: false
                };
            },
            isRecordDeleted() {
                this.setState({isRecordDeleted: true});
            },
            render() {
                const modifiedReport = Object.assign({}, reportDataParams);
                modifiedReport.reportData.isRecordDeleted = this.state.isRecordDeleted;
                return <ReportToolsAndContent ref="reportTools" flux={flux} params={reportParams} {...modifiedReport} />;
            }
        });

        component = TestUtils.renderIntoDocument(<MockParent />);
        spyOn(component.refs.reportTools, 'getFlux').and.returnValue(flux);
        spyOn(flux.actions, 'loadDynamicReport');
        component.isRecordDeleted();
        expect(flux.actions.loadDynamicReport).toHaveBeenCalledWith(reportParams.appId,
                                                                    reportParams.tblId,
                                                                    reportParams.rptId,
                                                                    reportParams.format,
                                                                    filter,
                                                                    queryParams);
    });

    it('test to check if page does not fetch records on failed delete', () => {
        let MockParent = React.createClass({
            getInitialState() {
                return {
                    isRecordDeleted: true
                };
            },
            isRecordDeleted() {
                this.setState({isRecordDeleted: false});
            },
            render() {
                const modifiedReport = Object.assign({}, reportDataParams);
                modifiedReport.reportData.isRecordDeleted = this.state.isRecordDeleted;
                return <ReportToolsAndContent ref="reportTools" flux={flux} params={reportParams} {...modifiedReport} />;
            }
        });

        component = TestUtils.renderIntoDocument(<MockParent />);
        spyOn(component.refs.reportTools, 'getFlux').and.returnValue(flux);
        spyOn(flux.actions, 'loadDynamicReport');
        component.isRecordDeleted();
        expect(flux.actions.loadDynamicReport).not.toHaveBeenCalled();
    });
});
