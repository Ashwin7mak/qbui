import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, createMemoryHistory} from 'react-router';
import TestUtils, {Simulate} from 'react-addons-test-utils';

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
const relatedChildReportUrl = `/qbase/app/${appId}/table/${childTableId}/report/${childReportId}?detailKeyFid=${detailKeyFid}&detailKeyValue=${detailKeyValue}`;

const MockChildReport = (props) => () => {
    props = Object.assign({
        appId,
        childTableId,
        childReportId,
        childTableName,
        detailKeyFid,
        detailKeyValue
    }, props);
    return <RelatedChildReport {...props} />;
};

// This is needed for testing the Link component rendered in RelatedChildReport
const MockRouter = (props = {}) => (
    <Router history={createMemoryHistory("/")}>
        <Route path="/" component={MockChildReport(props)} />
    </Router>
);

describe('RelatedChildReport', () => {
    let component, domComponent;

    describe('in Small Breakpoint', () => {
        it('displays a clickable link in small breakpoint', () => {
            RelatedChildReportRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);

            component = TestUtils.renderIntoDocument(MockChildReport()());
            domComponent = TestUtils.findRenderedDOMComponentWithTag(component, 'a');

            expect(domComponent).toBeTruthy();

            RelatedChildReportRewireAPI.__ResetDependency__('Breakpoints');
        });

        it('displays a clickable link to a child table in small breakpoint', () => {
            RelatedChildReportRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);

            component = TestUtils.renderIntoDocument(MockRouter());
            domComponent = TestUtils.findRenderedDOMComponentWithTag(component, 'a');

            expect(domComponent.getAttribute('href')).toEqual(relatedChildReportUrl);

            RelatedChildReportRewireAPI.__ResetDependency__('Breakpoints');
        });

        [
            "appId",
            "childTableId",
            "childReportId",
            "detailKeyFid",
            "detailKeyValue"
        ].forEach(prop => {
            it(`does not render a link if ${prop} is not defined`, () => {
                const props = {};
                props[prop] = undefined;
                component = TestUtils.renderIntoDocument(MockChildReport(props)());
                domComponent = TestUtils.scryRenderedDOMComponentsWithTag(component, 'a');

                expect(domComponent.length).toEqual(0);
            });
        });
    });
});
