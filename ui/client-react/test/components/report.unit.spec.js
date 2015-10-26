//import Fluxxor from 'fluxxor';

import React from 'react';
import ReactDOM from 'react-dom';
import Report from '../../src/components/report/reportRoute';

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
            loadReport: function() {return;}
        }
    };

    let ReportStageMock = React.createClass({
        render: function() {
            return <div className="stage-mock" />;
        }
    });
    let ReportContentMock = React.createClass({
        render: function() {
            return <div className="report-content" />;
        }
    });

    beforeEach(() => {
        Report.__Rewire__('Stage', ReportStageMock);
        Report.__Rewire__('ReportContent', ReportContentMock);
        spyOn(flux.actions, 'loadReport');
    });

    afterEach(() => {
        Report.__ResetDependency__('Stage', ReportStageMock);
        Report.__ResetDependency__('ReportContent', ReportContentMock);
        flux.actions.loadReport.calls.reset();
    });

    it('test render of report with no app data', () => {
        var div = document.createElement('div');
        component = ReactDOM.render(<Report  flux={flux}/>, div);

        var node = ReactDOM.findDOMNode(component);

        expect(node.querySelector('.stage-mock')).toBeDefined();
        expect(node.querySelector('.report-content')).toBeDefined();
    });

    it('test flux action loadReport is not called with no app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux} />, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test render of report with app data', () => {
        var div = document.createElement('div');
        component = ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams} />, div);

        var node = ReactDOM.findDOMNode(component);

        expect(node.querySelector('.stage-mock')).toBeDefined();
        expect(node.querySelector('.report-content')).toBeDefined();
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

    it('test flux action loadReport is called on 2nd called with different app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} reportData={reportDataParams} />, div);

        //  on subsequent call with the different parameter data, the loadReport function is expected to be called
        ReactDOM.render(<Report {...i18n} flux={flux} params={secondaryParams} reportData={reportDataParams}/>, div);
        expect(flux.actions.loadReport).toHaveBeenCalledWith(secondaryParams.appId, secondaryParams.tblId, secondaryParams.rptId, true);
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
