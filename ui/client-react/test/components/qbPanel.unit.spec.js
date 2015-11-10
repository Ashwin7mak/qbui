import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import QBPanel from '../../src/components/QBPanel/qbpanel.js';

const fakeQBPanelData_empty = {
    data: {
        title: ""
    }
};
const fakeQBPanelData_valid = {
    data: {
        title: "Testing"
    }
};

describe('QBPanel functions', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<QBPanel title={fakeQBPanelData_empty.data.title}></QBPanel>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var qbPanel = TestUtils.findRenderedDOMComponentWithClass(component, "card");
        expect(qbPanel).toBeDefined();
    });

    it('test qbPanel is collapsed by default', () => {
        component = TestUtils.renderIntoDocument(<QBPanel title={fakeQBPanelData_valid.data.title}/>);
        var node = ReactDOM.findDOMNode(component);
        var qbPanel = node.getElementsByClassName("collapse");
        expect(qbPanel[0].className).not.toContain("collapse in");
    });

    it('test expand qbPanel on click', (done) => {
        component = TestUtils.renderIntoDocument(<QBPanel title={fakeQBPanelData_valid.data.title}/>);
        var node = ReactDOM.findDOMNode(component);
        var header = node.getElementsByClassName("cardHeader");
        TestUtils.Simulate.click(header[0]);
        done();
        var qbPanel = node.getElementsByClassName("collapse");
        expect(qbPanel[0].className).toContain("collapse in");
    });
});
