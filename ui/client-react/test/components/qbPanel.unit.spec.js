import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import QBPanel from '../../src/components/QBPanel/qbpanel';

const fakeQBPanelData_valid = {
    data: {
        title: "Testing",
        isOpen: true
    }
};

describe('QBPanel functions', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<QBPanel title={fakeQBPanelData_valid.data.title}></QBPanel>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var qbPanel = ReactDOM.findDOMNode(component);
        expect(qbPanel).toBeDefined();
    });

    it('test qbPanel is collapsed by default', () => {
        component = TestUtils.renderIntoDocument(<QBPanel title={fakeQBPanelData_valid.data.title}/>);
        var node = ReactDOM.findDOMNode(component);
        var qbPanel = node.getElementsByClassName("collapse");
        expect(qbPanel[0].className).not.toContain("collapse in");
    });

    it('test qbPanel is expanded at render via prop', () => {
        component = TestUtils.renderIntoDocument(<QBPanel title={fakeQBPanelData_valid.data.title} isOpen={fakeQBPanelData_valid.data.isOpen}/>);
        var node = ReactDOM.findDOMNode(component);
        var qbPanel = node.getElementsByClassName("collapse");
        expect(qbPanel[0].className).toContain("collapse in");
    });

    it('test expand qbPanel on click', (done) => {
        component = TestUtils.renderIntoDocument(<QBPanel title={fakeQBPanelData_valid.data.title}/>);
        var node = ReactDOM.findDOMNode(component);
        var header = node.getElementsByClassName("qbPanelHeader");
        TestUtils.Simulate.click(header[0]);
        done();
        var qbPanel = node.getElementsByClassName("collapse");
        expect(qbPanel[0].className).toContain("collapse in");
    });
});
