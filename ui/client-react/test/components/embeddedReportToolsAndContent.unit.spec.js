import React from 'react';
import configureMockStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import serverTypeConsts from '../../../common/src/constants';

import EmbeddedReportToolsAndContent, {
    EmbeddedReportToolsAndContent as UnconnectedEmbeddedReportToolsAndContent,
    __RewireAPI__ as EmbeddedReportToolsAndContentRewireAPI,
    mapStateToProps
}  from '../../src/components/report/embedded/embeddedReportToolsAndContent';
const mockStore = configureMockStore();

describe('EmbeddedReportToolsAndContent', () => {
    let component;
    let offset = 0;
    let numRows = serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

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
        EmbeddedReportToolsAndContentRewireAPI.__Rewire__('TrackableReportToolsAndContent', ReportToolsAndContentMock);
    });

    afterAll(() => {
        EmbeddedReportToolsAndContentRewireAPI.__ResetDependency__('TrackableReportToolsAndContent');
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
        // manually call loadReportFromProps, normally this would be invoked by the `unloadable` HOC
        // which wraps ReportToolsAndContent
        component.instance().loadReportFromProps();
        expect(loadDynamicReportSpy).toHaveBeenCalledWith(
            uniqueId,
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

    it('receives the report data as a prop via mapStateToProps', () => {
        const data = 'data';
        const state = {embeddedReports: {[uniqueId]: data}};

        const propsFromState = mapStateToProps(state, {uniqueId: uniqueId});
        expect(propsFromState.report).toEqual(data);
    });
});
