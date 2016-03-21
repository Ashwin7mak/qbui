import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import GriddleTable  from '../../src/components/dataTable/griddleTable/griddleTable';
import Griddle from 'griddle-react';
import Loader  from 'react-loader';

var GriddleMock = React.createClass({

    contextTypes: {
        allowCardSelection: React.PropTypes.func,
        onToggleCardSelection: React.PropTypes.func,
        onRowSelected: React.PropTypes.func
    },

    render() {
        const allowSelection = this.context.allowCardSelection();
        return (
            <div>test</div>
        );
    },

    simulateToggleCardSelection(allowSelection) {
        this.context.onToggleCardSelection(allowSelection);
    },
    simulateRowSelection() {
        this.context.onRowSelected({id:1});
    }

});

var TableActionsMock = React.createClass({
    render: function() {return <div>table actions</div>;}
});

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

const fakeReportData_loading = {
    loading: true
};

const fakeReportData_empty = {
    data: {
        name: "",
        records: [],
        columns: []
    }
};

const fakeReportData_before = {
    data: {
        results: [{
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"
        }],
        columnMetadata: ["col_num", "col_text", "col_date"]
    }
};
const fakeReportData_after = {
    data: {
        results: [{
            col_num1: 2,
            col_text1: "xyz",
            col_date1: "01-01-2018"
        }],
        columnMetadata: ["col_num1", "col_text1", "col_date1"]
    }
};



describe('GriddleTable functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        GriddleTable.__Rewire__('Griddle', GriddleMock);
        GriddleTable.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        GriddleTable.__ResetDependency__('Griddle');
        GriddleTable.__ResetDependency__('I18nMessage');
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<GriddleTable actions={TableActionsMock} results={fakeReportData_empty.data.records} columnMetadata={fakeReportData_empty.data.columns}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of loader', () => {
        component = TestUtils.renderIntoDocument(<GriddleTable actions={TableActionsMock}   reportData={fakeReportData_loading}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, Loader).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, Griddle).length).toEqual(0);
    });

    it('test render with empty data', () => {
        component = TestUtils.renderIntoDocument(<GriddleTable columnMetadata={fakeReportData_empty.data.columns}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, Griddle).length).toEqual(0);
        expect(ReactDOM.findDOMNode(component).textContent).toMatch("test");
    });

    it('test render with small touchscreen breakpoint', () => {
        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                touch: React.PropTypes.bool
            },
            getChildContext: function() {
                return {touch:true};
            },
            getInitialState() {
                return {results: fakeReportData_before.data.results, columns: fakeReportData_before.data.columnMetadata};
            },
            render() {
                return <GriddleTable ref="refGriddle" results={this.state.results} columnMetadata={this.state.columns}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        parent.setState({
            results: fakeReportData_after.data.results,
            columns: fakeReportData_empty.data.columns
        });

        var griddle = TestUtils.scryRenderedComponentsWithType(parent.refs.refGriddle, GriddleMock);
        expect(griddle.length).toEqual(1);
        expect(griddle[0].props.useCustomRowComponent).toBeTruthy();

        griddle[0].simulateToggleCardSelection(true);
        griddle[0].simulateToggleCardSelection(false);

        griddle[0].simulateRowSelection();
        // reselect same row to toggle
        griddle[0].simulateRowSelection();
    });

    it('test re-render with new data pushed from parent', () => {
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {results: fakeReportData_before.data.results, columns: fakeReportData_before.data.columnMetadata};
            },
            render() {
                return <GriddleTable ref="refGriddle" results={this.state.results} columnMetadata={this.state.columns}/>;
            }
        }));

        var parent = TestUtils.renderIntoDocument(TestParent());

        parent.setState({
            results: fakeReportData_after.data.results,
            columns: fakeReportData_after.data.columnMetadata
        });

        expect(parent.refs.refGriddle.props.results).toEqual(fakeReportData_after.data.results);
        expect(parent.refs.refGriddle.props.columnMetadata).toEqual(fakeReportData_after.data.columnMetadata);
    });
});

