import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Report from '../../src/components/report/reportRoute';
import ReportToolbar from '../../src/components/report/reportToolbar';
import Stage from '../../src/components/stage/stage';

import Locale from '../../src/locales/locales';
var i18n = Locale.getI18nBundle();

describe('Report functions', () => {
    'use strict';

    let component;
    let reportDataParams = {reportData: {loading:false}};

    let reportParams = {appId:1, tblId:2, rptId:3};
    let secondaryParams = {appId:4, tblId:5, rptId:6};

    let flux = {
        actions:{
            loadReport() {return;},
            filterReport() {return;}
        }
    };

    let ReportStageMock = React.createClass({
        render() {
            return <div className="stage-mock" />;
        }
    });
    let ReportContentMock = React.createClass({
        render() {
            return <div className="report-content-mock" />;
        }
    });

    beforeEach(() => {
        Report.__Rewire__('ReportStage', ReportStageMock);
        Report.__Rewire__('ReportToolsAndContent', ReportContentMock);
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'filterReport');
    });

    afterEach(() => {
        Report.__ResetDependency__('ReportStage', ReportStageMock);
        Report.__ResetDependency__('ReportToolsAndContent', ReportContentMock);
        flux.actions.loadReport.calls.reset();
        flux.actions.filterReport.calls.reset();
    });

    it('test render of report', () => {
        var div = document.createElement('div');
        component = ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(1);

        //  test that the Stage component is rendered, and that the ReportStageMock component is a child
        var _Stage = TestUtils.scryRenderedComponentsWithType(component, Stage);
        expect(TestUtils.scryRenderedComponentsWithType(component, Stage).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(_Stage[0], ReportStageMock).length).toEqual(1);
    });

    it('test flux action loadReport is not called with no app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux}  />, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test flux action loadReport is called with app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams} />, div);
        expect(flux.actions.loadReport).toHaveBeenCalledWith(reportParams.appId, reportParams.tblId, reportParams.rptId, true);
    });

    it('test flux action loadReport is not called on 2nd called with same app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams} />, div);
        expect(flux.actions.loadReport).toHaveBeenCalled();

        //  on subsequent call with same parameter data, the loadReport function is not called
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams}/>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalledWith();
    });

    it('test flux action loadReport is not called with missing app data', () => {
        var div = document.createElement('div');

        reportParams.appId = null;
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams}/>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test flux action loadReport is not called with app data while reportData loading is true', () => {

        var div = document.createElement('div');

        reportDataParams.reportData.loading = true;
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams} />, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

});
