import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import CellRenderers from '../../src/components/dataTable/agGrid/cellRenderers';
import CellValueRenderers from '../../src/components/dataTable/agGrid/cellValueRenderers';

import {DateCellRenderer, DateTimeCellRenderer, TimeCellRenderer, NumericCellRenderer, TextCellRenderer, CheckBoxCellRenderer} from '../../src/components/dataTable/agGrid/cellRenderers';

describe('AGGrid cell editor functions', () => {
    'use strict';

    let component;

    var I18nMessageMock = React.createClass({
        render: function() {
            return <span>{this.props.value}</span>;
        }
    });

    beforeEach(() => {

        CellRenderers.__Rewire__('I18nDate', I18nMessageMock);
        CellRenderers.__Rewire__('I18nNumber', I18nMessageMock);
        CellValueRenderers.__Rewire__('I18nNumber', I18nMessageMock);
    });

    afterEach(() => {

        CellRenderers.__ResetDependency__('I18nDate');
        CellRenderers.__ResetDependency__('I18nNumber');
        CellValueRenderers.__ResetDependency__('I18nNumber');
    });

    it('test TextCellRenderer', () => {
        const params = {
            value: {
                value: "Testing",
                display: "Testing"
            },
            column: {
                colDef: {}
            }
        };

        component = TestUtils.renderIntoDocument(<TextCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const value = TestUtils.findRenderedDOMComponentWithClass(component, "textCell");
        expect(value.innerHTML).toEqual(params.value.display);

        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("text");
        expect(edit.value).toEqual(params.value.display);

        edit.value = "newValue";
        TestUtils.Simulate.change(edit);
        expect(value.innerHTML).toEqual("newValue");
    });

    it('test NumericCellRenderer', () => {
        const params = {
            value: {
                value: 123,
                display: "123"
            },
            column: {
                colDef: {
                    datatypeAttributes: {}
                }
            }
        };

        component = TestUtils.renderIntoDocument(<NumericCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const valueElements = ReactDOM.findDOMNode(component).querySelectorAll(".numberCell span");
        expect(valueElements.length).toBe(1);

        expect(valueElements[0].innerHTML).toEqual(params.value.display);

        const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
        expect(edit.type).toEqual("number");

        edit.value = 456;
        TestUtils.Simulate.change(edit);
        expect(valueElements[0].innerHTML).toEqual("456");
    });

    it('test CheckBoxCellRenderer', () => {
        const params = {
            value: {
                value: true
            },
            column: {
                colDef: {}
            }
        };

        component = TestUtils.renderIntoDocument(<CheckBoxCellRenderer params={params} />);
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
            value: {
                value: "2097-01-17"
            },
            column: {
                colDef: {}
            }
        };

        component = TestUtils.renderIntoDocument(<DateCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test DateTimeFormatter', () => {
        const params = {
            value: {
                value: "2097-01-17T00:33:03Z",
            },
            column: {
                colDef: {}
            }
        };

        component = TestUtils.renderIntoDocument(<DateTimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test TimeFormatter', () => {
        const params = {
            value: {
                value: "1970-01-01T19:13:44Z"
            },
            column: {
                colDef: {}
            }
        };

        component = TestUtils.renderIntoDocument(<TimeCellRenderer params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});

