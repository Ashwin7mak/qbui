import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewNavigation from '../../src/components/dataTable/cardView/cardViewNavigation';

const fakeData = {
    valid: {
        getNextReportPage: null
    }
};

describe('CardViewHeader component render tests', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<CardViewNavigation getNextReportPage={fakeData.valid.getNextReportPage}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var parentDiv = ReactDOM.findDOMNode(component);

        // Test render of footer div
        var footerDiv  = parentDiv.getElementsByClassName("cardViewHeader");
        expect(footerDiv).toBeDefined();

        // Test render of fetch next button
        var buttonDiv = parentDiv.getElementsByClassName("fetchPreviousButton");
        expect(buttonDiv).toBeDefined();

        // Test render of fetch next arrow
        var fetchNextArrow = parentDiv.getElementsByClassName("fetchPreviousArrow");
        expect(fetchNextArrow).toBeDefined();

        // Test render of loading indicator
        var loadingIndicator = parentDiv.getElementsByClassName("headerLoadingIndicator");
        expect(loadingIndicator).toBeDefined();
    });
});
