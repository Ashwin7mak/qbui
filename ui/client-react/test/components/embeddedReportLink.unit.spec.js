import React from 'react';
import configureMockStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {MemoryRouter, Link} from 'react-router-dom';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import serverTypeConsts from '../../../common/src/constants';

import EmbeddedReportLink, {
    EmbeddedReportLink as UnconnectedEmbeddedReportLink,
    __RewireAPI__ as EmbeddedReportLinkRewireAPI
}  from '../../src/components/report/embedded/embeddedReportLink';
const mockStore = configureMockStore();

describe('EmbeddedReportLink', () => {
    let component;

    const appId = 1;
    const childTableId = 2;
    const childReportId = 3;
    const detailKeyFid = 4;
    const detailKeyValue = 5;
    const childTableName = `Yogi's Awesome Bespoke Table`;
    const uniqueId = 'CONTEXT6';
    const props = {
        appId,
        childTableId,
        childReportId,
        detailKeyFid,
        detailKeyValue,
        childTableName,
        uniqueId
    };

    const report = {
        recordsCount: 42
    };

    const LinkMock = React.createClass({
        render() {
            return <div className="linkMock" />;
        }
    });

    const mockLoadReportRecordsCount = () => ({type:'mock'});

    beforeAll(() => {
        jasmineEnzyme();
        EmbeddedReportLinkRewireAPI.__Rewire__('Link', LinkMock);
        EmbeddedReportLinkRewireAPI.__Rewire__('loadReportRecordsCount', mockLoadReportRecordsCount);

    });

    afterAll(() => {
        EmbeddedReportLinkRewireAPI.__ResetDependency__('Link');
        EmbeddedReportLinkRewireAPI.__ResetDependency__('loadReportRecordsCount');
    });

    it('renders component', () => {
        const store = mockStore({embeddedReports: {}});

        component = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <EmbeddedReportLink />
                </MemoryRouter>
            </Provider>);
        expect(component).toBePresent();
    });

    it('calls unloadEmbeddedReport when component unmounts', () => {
        let mockUnloadEmbeddedReport = jasmine.createSpy().and.callFake(() => ({type:'mock'}));
        EmbeddedReportLinkRewireAPI.__Rewire__('unloadEmbeddedReport', mockUnloadEmbeddedReport);
        const store = mockStore({embeddedReports: {}});

        component = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <EmbeddedReportLink />
                </MemoryRouter>
            </Provider>);
        component.unmount();
        expect(mockUnloadEmbeddedReport).toHaveBeenCalled();

        EmbeddedReportLinkRewireAPI.__ResetDependency__('unloadEmbeddedReport');
    });

    it('calls loadReportRecordsCount with proper arguments', () => {
        const loadReportRecordsCountSpy = jasmine.createSpy('loadReportRecordsCountSpy');

        component = mount(
            <UnconnectedEmbeddedReportLink loadReportRecordsCount={loadReportRecordsCountSpy} {...props} />
        );
        expect(loadReportRecordsCountSpy).toHaveBeenCalledWith(
            uniqueId,
            appId,
            childTableId,
            childReportId,
            jasmine.objectContaining({
                query: `{${detailKeyFid}.EX.'${detailKeyValue}'}`
            })
        );
    });

    it('renders a Link', () => {
        component = mount(
            <UnconnectedEmbeddedReportLink
                loadReportRecordsCount={() => null}
                report={report}
                {...props} />
        );
        expect(component.find(LinkMock).length).toEqual(1);
    });

    it(`displays child table's name`, () => {
        component = mount(
            <UnconnectedEmbeddedReportLink
                loadReportRecordsCount={() => null}
                report={report}
                {...props} />
        );
        expect(component.text()).toContain(childTableName);
    });

    it('displays records count', () => {
        component = mount(
            <UnconnectedEmbeddedReportLink
                loadReportRecordsCount={() => null}
                report={report}
                {...props} />
        );
        expect(component.text()).toContain(report.recordsCount);
    });
});
