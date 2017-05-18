import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, createMemoryHistory} from 'react-router-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ChildReport, {__RewireAPI__ as ChildReportRewireAPI} from '../../src/components/QBForm/childReport';

class BreakpointsAlwaysSmallMock {
    static isSmallBreakpoint() {
        return true;
    }
}

const appId = 1;
const childTableId = 2;
const childReportId = 3;
const childTableName = 'child table';
const detailKeyFid = 4;
const detailKeyValue = 5;
const type = 'EMBEDREPORT';
const childReportUrl = `/qbase/app/${appId}/table/${childTableId}/report/${childReportId}?detailKeyFid=${detailKeyFid}&detailKeyValue=${detailKeyValue}`;

const MockChildReport = (props) => {
    props = Object.assign({
        appId,
        childTableId,
        childReportId,
        childTableName,
        detailKeyFid,
        detailKeyValue,
        type
    }, props);
    return <ChildReport {...props} />;
};

const EmbeddedReportToolsAndContentMock = (props) => <div className="embeddedReportContainer"></div>;
const EmbeddedReportLinkMock = (props) => <div className="embeddedReportLink"></div>;

describe('ChildReport', () => {
    beforeAll(() => {
        jasmineEnzyme();
        ChildReportRewireAPI.__Rewire__('EmbeddedReportToolsAndContent', EmbeddedReportToolsAndContentMock);
        ChildReportRewireAPI.__Rewire__('EmbeddedReportLink', EmbeddedReportLinkMock);
    });

    afterAll(() => {
        ChildReportRewireAPI.__ResetDependency__('EmbeddedReportToolsAndContent');
        ChildReportRewireAPI.__Rewire__('EmbeddedReportLink');
    });

    let component, domComponent;

    it(`renders the component`, () => {
        component = shallow(MockChildReport());
        expect(component).toBePresent();
    });

    [
        "appId",
        "childTableId",
        "childReportId",
        "detailKeyFid",
        "detailKeyValue"
    ].forEach(prop => {
        it(`does not render if ${prop} is not defined`, () => {
            const props = {};
            props[prop] = undefined;
            component = shallow(MockChildReport(props));
            expect(component.find(ChildReport)).not.toBePresent();

            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);
            const embeddedReportLink = component.find(EmbeddedReportLinkMock);
            expect(embeddedReportContainer).not.toBePresent();
            expect(embeddedReportLink).not.toBePresent();
        });
    });

    describe('in Large/Medium breakpoint', () => {
        it('renders EmbeddedReportToolsAndContent', () => {
            component = shallow(MockChildReport());
            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);
            expect(embeddedReportContainer).toBePresent();
        });

        it('passes the needed props to EmbeddedReportToolsAndContent', () => {
            component = shallow(MockChildReport());
            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);

            const passedProps = embeddedReportContainer.props();
            const expectedProps = {
                appId: appId,
                tblId: childTableId,
                rptId: childReportId,
                detailKeyFid: detailKeyFid,
                detailKeyValue: detailKeyValue
            };

            expect(passedProps.appId).toEqual(expectedProps.appId);
            expect(passedProps.tblId).toEqual(expectedProps.tblId);
            expect(passedProps.rptId).toEqual(expectedProps.rptId);
            expect(passedProps.detailKeyFid).toEqual(expectedProps.detailKeyFid);
            expect(passedProps.detailKeyValue).toEqual(expectedProps.detailKeyValue);
        });
    });

    describe('in Small Breakpoint', () => {
        beforeAll(() => {
            ChildReportRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        });
        afterAll(() => {
            ChildReportRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('renders EmbeddedReportLink', () => {
            component = shallow(MockChildReport());
            const embeddedReportLink = component.find(EmbeddedReportLinkMock);
            expect(embeddedReportLink).toBePresent();
        });
    });
});
