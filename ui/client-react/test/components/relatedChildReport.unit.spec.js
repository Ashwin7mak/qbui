import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, createMemoryHistory} from 'react-router';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import RelatedChildReport, {__RewireAPI__ as RelatedChildReportRewireAPI} from '../../src/components/QBForm/relatedChildReport';

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
const relatedChildReportUrl = `/qbase/app/${appId}/table/${childTableId}/report/${childReportId}?detailKeyFid=${detailKeyFid}&detailKeyValue=${detailKeyValue}`;

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
    return <RelatedChildReport {...props} />;
};

const EmbeddedReportToolsAndContentMock = (props) => <div className="embeddedReportContainer"></div>;
const EmbeddedReportLinkMock = (props) => <div className="embeddedReportLink"></div>;

describe('RelatedChildReport', () => {
    beforeAll(() => {
        jasmineEnzyme();
        RelatedChildReportRewireAPI.__Rewire__('EmbeddedReportToolsAndContent', EmbeddedReportToolsAndContentMock);
        RelatedChildReportRewireAPI.__Rewire__('EmbeddedReportLink', EmbeddedReportLinkMock);
    });

    afterAll(() => {
        RelatedChildReportRewireAPI.__ResetDependency__('EmbeddedReportToolsAndContent');
        RelatedChildReportRewireAPI.__Rewire__('EmbeddedReportLink');
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
            //expect(component).not.toBePresent();
        });
    });

    describe('in Large/Medium breakpoint', () => {
        it('renders EmbeddedReportToolsAndContent', () => {
            component = shallow(MockChildReport());
            const embeddedReportContainer = component.find(EmbeddedReportToolsAndContentMock);
            expect(embeddedReportContainer.length).toEqual(1);
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
            RelatedChildReportRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        });
        afterAll(() => {
            RelatedChildReportRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('renders EmbeddedReportLink', () => {
            component = shallow(MockChildReport());
            const embeddedReportLink = component.find(EmbeddedReportLinkMock);
            expect(embeddedReportLink.length).toEqual(1);
        });
    });
});
