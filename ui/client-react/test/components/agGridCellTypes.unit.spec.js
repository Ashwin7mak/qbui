import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import Formatters from '../../src/components/dataTable/agGrid/formatters';
import {DateFormatter, DateTimeFormatter, TimeFormatter, NumericFormatter, TextFormatter, CheckBoxFormatter} from '../../src/components/dataTable/agGrid/formatters';

describe('AGGrid cell editor functions', () => {
    'use strict';

    let component;

    var I18nMessageMock = React.createClass({
        render: function() {
            return <span>{this.props.value}</span>;
        }
    });

    beforeEach(() => {
        Formatters.__Rewire__('I18nNumber', I18nMessageMock);
        Formatters.__Rewire__('I18nDate', I18nMessageMock);
    });

    afterEach(() => {
        Formatters.__ResetDependency__('I18nNumber');
        Formatters.__ResetDependency__('I18nDate');
    });

    it('test TextFormatter', () => {
        const params = {
            value: "Testing",
            colDef: {}
        };

        component = TestUtils.renderIntoDocument(<TextFormatter params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = TestUtils.findRenderedDOMComponentWithClass(component, "cellData");
        expect(value.innerHTML).toEqual(params.value);

        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("text");
        expect(edit.value).toEqual(params.value);

        edit.value = "newValue";
        TestUtils.Simulate.change(edit);
        expect(value.innerHTML).toEqual("newValue");
    });

    it('test NumericFormatter', () => {
        const params = {
            value: 123,
            colDef: {}
        };

        component = TestUtils.renderIntoDocument(<NumericFormatter params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = ReactDOM.findDOMNode(component).querySelector(".cellData span");
        expect(value.innerHTML).toEqual(params.value.toString());

        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("number");

        edit.value = 456;
        TestUtils.Simulate.change(edit);
        expect(value.innerHTML).toEqual("456");
    });

    it('test CheckBoxFormatter', () => {
        const params = {
            value: true,
            colDef: {}
        };

        component = TestUtils.renderIntoDocument(<CheckBoxFormatter params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const inputs = ReactDOM.findDOMNode(component).querySelectorAll(".cellData input");
        expect(inputs.length).toEqual(1);
        expect(inputs[0].checked).toBe(true);

        const editInputs = ReactDOM.findDOMNode(component).querySelectorAll("input.cellEdit");
        expect(editInputs.length).toEqual(1);
        TestUtils.Simulate.change(editInputs[0], {"target": {"checked": false}});
        expect(inputs[0].checked).toBe(false);
    });

    it('test DateFormatter', () => {
        const params = {
            value: "2097-01-17T00:33:03Z",
            colDef: {}
        };

        component = TestUtils.renderIntoDocument(<DateFormatter params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = ReactDOM.findDOMNode(component).querySelector(".cellData span");
        expect(value.innerHTML).toEqual(params.value);
    });

    it('test DateTimeFormatter', () => {
        const params = {
            value: "2097-01-17T00:33:03Z",
            colDef: {}
        };

        component = TestUtils.renderIntoDocument(<DateTimeFormatter params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = ReactDOM.findDOMNode(component).querySelector(".cellData");
        expect(value.innerHTML).toEqual("01/16/97 7:33:03 PM");
    });

    it('test TimeFormatter', () => {
        const params = {
            value: "1970-01-01T19:13:44Z",
            colDef: {}
        };

        component = TestUtils.renderIntoDocument(<TimeFormatter params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = ReactDOM.findDOMNode(component).querySelector(".cellData");
        expect(value.innerHTML).toEqual("2:13:44 PM");
    });
});

