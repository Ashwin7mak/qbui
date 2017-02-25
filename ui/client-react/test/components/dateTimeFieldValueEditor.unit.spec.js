import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import DateTimeFieldValueEditor from '../../src/components/fields/dateTimeFieldValueEditor';
import DateFieldValueEditor, {__RewireAPI__ as DateFieldValueEditorRewireAPI} from '../../src/components/fields/dateFieldValueEditor';
import TimeFieldValueEditor, {__RewireAPI__ as TimeFieldValueEditorRewireAPI} from '../../src/components/fields/timeFieldValueEditor';


class BreakpointsAlwaysSmallMock {
    static isSmallBreakpoint() {
        return true;
    }
}

function buildMockParent(options = {}) {
    return React.createClass({
        getInitialState() {
            return {value: '1999-01-01T19:53:42.531Z[UTC]', display: null};
        },
        getChildContext() {
            return {touch: !!options.touch};
        },
        render() {
            return (
                (options.time &&
                    <TimeFieldValueEditor
                        ref="timeEditor"
                        value={this.state.value}
                        {...options}
                    />
                ) ||
                (options.date &&
                    <DateFieldValueEditor
                        ref="dateEditor"
                        value={this.state.value}
                        {...options}
                    />
                ) ||
                (<DateTimeFieldValueEditor
                    ref="dateTimeEditor"
                    value={this.state.value}
                    {...options}
                />)
            );
        },
        childContextTypes: {
            touch: React.PropTypes.bool
        }
    });
}

const datePickerSelector = '.dateCell input[type=text]';
const dateNativeInputSelector = '.dateCell input[type=date]';
const timeDropdownSelector = '.timeCell .Select input';
const timeNativeInputSelector = '.timeCell input[type=time]';

describe('dateFieldValueEditor', () => {
    it('renders date picker on large breakpoint devices', () => {
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent({date: true})));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(datePickerSelector)).toBeTruthy();
    });
    it('renders date picker on small breakpoint devices', () => {
        DateFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent({date: true})));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(datePickerSelector)).toBeTruthy();
        DateFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
    });
    it('renders native date input on small breakpoint touch devices', () => {
        DateFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent({date: true, touch: true})));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(datePickerSelector)).toBeFalsy();
        expect(ReactDOM.findDOMNode(parentComponent).querySelector(dateNativeInputSelector)).toBeTruthy();
        DateFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
    });
});

describe('timeFieldValueEditor', () => {
    it('renders Select dropdown on large breakpoint devices', () => {
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent({time: true})));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(timeDropdownSelector)).toBeTruthy();
    });
    it('renders Select dropdown on small breakpoint devices', () => {
        TimeFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent({time: true})));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(timeDropdownSelector)).toBeTruthy();
        TimeFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
    });
    it('renders native time input on small breakpoint touch devices', () => {
        TimeFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent({time: true, touch: true})));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(timeDropdownSelector)).toBeFalsy();
        expect(ReactDOM.findDOMNode(parentComponent).querySelector(timeNativeInputSelector)).toBeTruthy();
        TimeFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
    });
});


describe('dateTimeFieldValueEditor', () => {
    it('renders date editor and time editor', () => {
        let component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));

        expect(TestUtils.scryRenderedComponentsWithType(component, DateFieldValueEditor).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, TimeFieldValueEditor).length).toEqual(1);
    });
    it('does not render time editor when specified', () => {
        let component = TestUtils.renderIntoDocument(React.createElement(buildMockParent({attributes:{showTime: false}})));

        expect(TestUtils.scryRenderedComponentsWithType(component, DateFieldValueEditor).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, TimeFieldValueEditor).length).toEqual(0);
    });
    it('renders date picker and time Select dropdown on large breakpoint devices', () => {
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(datePickerSelector)).toBeTruthy();
        expect(ReactDOM.findDOMNode(parentComponent).querySelector(timeDropdownSelector)).toBeTruthy();
    });
    it('renders date picker and time Select dropdown on small breakpoint devices', () => {
        DateFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        TimeFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(datePickerSelector)).toBeTruthy();
        expect(ReactDOM.findDOMNode(parentComponent).querySelector(timeDropdownSelector)).toBeTruthy();
        DateFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
        TimeFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
    });
    it('renders native date input and time input on small breakpoint touch devices', () => {
        DateFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        TimeFieldValueEditorRewireAPI.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        let parentComponent = TestUtils.renderIntoDocument(React.createElement(buildMockParent({touch: true})));

        expect(ReactDOM.findDOMNode(parentComponent).querySelector(dateNativeInputSelector)).toBeTruthy();
        expect(ReactDOM.findDOMNode(parentComponent).querySelector(timeNativeInputSelector)).toBeTruthy();
        DateFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
        TimeFieldValueEditorRewireAPI.__ResetDependency__('Breakpoints');
    });
});
