import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import configureMockStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import EmbeddedReportToolsAndContent, {
    EmbeddedReportToolsAndContent as UnconnectedEmbeddedReportToolsAndContent,
    __RewireAPI__ as EmbeddedReportToolsAndContentRewireAPI
}  from '../../src/components/report/embeddedReportToolsAndContent';
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
    const props = {
        appId,
        tblId,
        rptId,
        detailKeyFid,
        detailKeyValue
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

    it('calls loadDynamicEmbeddedReport with proper arguments', () => {
        const spy = jasmine.createSpy('spy');

        component = mount(
            <UnconnectedEmbeddedReportToolsAndContent loadDynamicEmbeddedReport={spy} {...props} />
        );
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(
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

    it('generates uniqueId context used to identify report in store', () => {
        const spy = jasmine.createSpy('spy');

        const component1 = mount(
            <UnconnectedEmbeddedReportToolsAndContent loadDynamicEmbeddedReport={spy} {...props} />
        );
        const component2 = mount(
            <UnconnectedEmbeddedReportToolsAndContent loadDynamicEmbeddedReport={spy} {...props} />
        );
        expect(spy).toHaveBeenCalled();
        expect(spy.calls.count()).toEqual(2);
        expect(spy.calls.argsFor(0)[0]).not.toEqual(spy.calls.argsFor(1)[0]);
    });

    it('renders embedded report when a corresponding report exists in the store', () => {
        component = mount(
            <UnconnectedEmbeddedReportToolsAndContent loadDynamicEmbeddedReport={() => null} {...props} />
        );

        // manually set the instance's uniqueId to 42
        const instance = component.instance();
        instance.uniqueId = 42;
        // populate mock store with a single report corresponding to the component's instance
        component.setProps({reports: {42: {}}});

        expect(component.find(ReportToolsAndContentMock).length).toEqual(1);
    });

    it('does not render embedded report when a record is not available', () => {
        component = mount(
            <UnconnectedEmbeddedReportToolsAndContent loadDynamicEmbeddedReport={() => null} {...props} />
        );
        expect(component.find(ReportToolsAndContentMock).length).toEqual(0);
    });
});
