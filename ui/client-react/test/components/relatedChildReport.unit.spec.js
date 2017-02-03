import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, createMemoryHistory} from 'react-router';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import RelatedChildReport from '../../src/components/QBForm/relatedChildReport';

class BreakpointsAlwaysSmallMock {
    static isSmallBreakpoint() {
        return true;
    }
}

const appId = 1;
const childTableId = 2;
const childReportId = 3;
const childTableName = 'child table';
const foreignKeyFid = 4;
const foreignKeyValue = 5;
const relatedChildReportUrl = `/qbase/app/${appId}/table/${childTableId}/report/${childReportId}/foreignKeyFid/${foreignKeyFid}/foreignKeyValue/${foreignKeyValue}`;

const MockChildReport = (props) => () => {
    props = Object.assign({
        appId,
        childTableId,
        childReportId,
        childTableName,
        foreignKeyFid,
        foreignKeyValue
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
            RelatedChildReport.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);

            component = TestUtils.renderIntoDocument(MockChildReport()());
            domComponent = TestUtils.findRenderedDOMComponentWithTag(component, 'a');

            expect(domComponent).toBeTruthy();

            RelatedChildReport.__ResetDependency__('Breakpoints');
        });

        it('displays a clickable link to a child table in small breakpoint', () => {
            RelatedChildReport.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);

            component = TestUtils.renderIntoDocument(MockRouter());
            domComponent = TestUtils.findRenderedDOMComponentWithTag(component, 'a');

            expect(domComponent.getAttribute('href')).toEqual(relatedChildReportUrl);

            RelatedChildReport.__ResetDependency__('Breakpoints');
        });

        [
            "appId",
            "childTableId",
            "childReportId",
            "foreignKeyFid",
            "foreignKeyValue"
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
