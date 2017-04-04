import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import configureMockStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import EmbeddedReportToolsAndContent, {
    EmbeddedReportToolsAndContent as UnconnectedEmbeddedReportToolsAndContent,
    __RewireAPI__ as EmbeddedReportToolsAndContentRewireAPI,
    mapStateToProps
}  from '../../src/components/report/embedded/embeddedReportToolsAndContent';
const mockStore = configureMockStore();

describe('EmbeddedReportToolsAndContent', () => {
    let component;
    let offset = 0;
    let numRows = 20;

    const appId = 1;
    const tblId = 2;
    const rptId = 3;
    const detailKeyFid = 4;
    const detailKeyValue = 5;
    const uniqueId = 'CONTEXT6';
    const props = {
        appId,
        tblId,
        rptId,
        detailKeyFid,
        detailKeyValue,
        uniqueId
    };

    const report = {
        reportData: {
            appId,
            tblId,
            rptId
        }
    };

    const ReportToolsAndContentMock = React.createClass({
        render() {
            return <div className="report-content-mock" />;
        }
    });

    beforeAll(() => {
        jasmineEnzyme();
        EmbeddedReportToolsAndContentRewireAPI.__Rewire__('ReportToolsAndContent', ReportToolsAndContentMock);
    });

    afterAll(() => {
        EmbeddedReportToolsAndContentRewireAPI.__ResetDependency__('ReportToolsAndContent');
    });

    it('test render of component', () => {
        const store = mockStore({});

        component = mount(
            <Provider store={store}>
                <EmbeddedReportToolsAndContent />
            </Provider>);
        expect(component).toBePresent();
    });

    it('calls loadDynamicReport with proper arguments', () => {
        const loadDynamicReportSpy = jasmine.createSpy('loadDynamicReportSpy');

        component = mount(
            <UnconnectedEmbeddedReportToolsAndContent loadDynamicReport={loadDynamicReportSpy} {...props} />
        );
        expect(loadDynamicReportSpy).toHaveBeenCalled();
        expect(loadDynamicReportSpy).toHaveBeenCalledWith(
            jasmine.any(String),
            appId,
            tblId,
            rptId,
            true,
            jasmine.any(Object),
            jasmine.objectContaining({
                offset,
                numRows,
                query: `{${detailKeyFid}.EX.'${detailKeyValue}'}`
            })
        );
    });

    it('renders embedded report when a corresponding report exists in the store', () => {
        component = mount(
            <UnconnectedEmbeddedReportToolsAndContent
                loadDynamicReport={() => null}
                report={report}
                {...props} />
        );

        expect(component.find(ReportToolsAndContentMock).length).toEqual(1);
    });

    it('does not render embedded report when a record is not available', () => {
        component = mount(
            <UnconnectedEmbeddedReportToolsAndContent loadDynamicReport={() => null} {...props} />
        );
        expect(component.find(ReportToolsAndContentMock).length).toEqual(0);
    });

    it('receives the report data as a prop via mapStateToProps', () => {
        const data = 'data';
        const state = {embeddedReports: {[uniqueId]: data}};

        const propsFromState = mapStateToProps(state, {uniqueId: uniqueId});
        expect(propsFromState.report).toEqual(data);
    });
});
