import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import Formatters from '../../src/components/dataTable/agGrid/formatters';
import {DateCellFormatter, DateTimeCellFormatter, TimeCellFormatter, NumericCellFormatter, TextCellFormatter, CheckBoxCellFormatter} from '../../src/components/dataTable/agGrid/formatters';

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
            value: {
                value: "Testing",
                display: "Testing"
            },
            column: {
                colDef: {}
            }
        };

        component = TestUtils.renderIntoDocument(<TextCellFormatter params={params} />);
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

    //it('test NumericFormatter', () => {
    //    const params = {
    //        value: {
    //            value: 123,
    //            display: "123"
    //        },
    //        column: {
    //            colDef: {}
    //        }
    //    };
    //
    //    component = TestUtils.renderIntoDocument(<NumericCellFormatter params={params} />);
    //    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    //
    //    const value = TestUtils.findRenderedDOMComponentWithClass(component, "numberCell");
    //    expect(value.innerHTML).toEqual(params.value.toString());
    //
    //    const edit = TestUtils.findRenderedDOMComponentWithClass(component, "cellEdit");
    //    expect(edit.type).toEqual("number");
    //
    //    edit.value = 456;
    //    TestUtils.Simulate.change(edit);
    //    expect(value.innerHTML).toEqual("456");
    //});

    it('test CheckBoxFormatter', () => {
        const params = {
            value: {
                value: true
            },
            column: {
                colDef: {}
            }
        };

        component = TestUtils.renderIntoDocument(<CheckBoxCellFormatter params={params} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const inputs = ReactDOM.findDOMNode(component).querySelectorAll(".cellData input");
        expect(inputs.length).toEqual(1);
        expect(inputs[0].checked).toBe(true);

        const editInputs = ReactDOM.findDOMNode(component).querySelectorAll("input.cellEdit");
        expect(editInputs.length).toEqual(1);
        TestUtils.Simulate.change(editInputs[0], {"target": {"checked": false}});
        expect(inputs[0].checked).toBe(false);
    });

    //it('test DateFormatter', () => {
    //    const params = {
    //        value: "2097-01-17T00:33:03Z",
    //        column: {
    //            colDef: {}
    //        }
    //    };
    //
    //    component = TestUtils.renderIntoDocument(<DateCellFormatter params={params} />);
    //    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    //});
    //
    //it('test DateTimeFormatter', () => {
    //    const params = {
    //        value: "2097-01-17T00:33:03Z",
    //        column: {
    //            colDef: {}
    //        }
    //    };
    //
    //    component = TestUtils.renderIntoDocument(<DateTimeCellFormatter params={params} />);
    //    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    //
    //});
    //
    //it('test TimeFormatter', () => {
    //    const params = {
    //        value: "1970-01-01T19:13:44Z",
    //        column: {
    //            colDef: {}
    //        }
    //    };
    //
    //    component = TestUtils.renderIntoDocument(<TimeCellFormatter params={params} />);
    //    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    //});
});

