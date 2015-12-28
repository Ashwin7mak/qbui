import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardView from '../../src/components/dataTable/griddleTable/cardView';
import RecordActions from '../../src/components/actions/recordActions';

var RecordActionsMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

const fakeReportData_empty = {
    data: {
        results: [],
        columnMetadata: []
    }
};
const fakeReportData_valid = {
    data: {
        results: {
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"/*,
            col_4: 2,
            col_5: 3,
            col_6: 4*/
        },
        columnMetadata: ["col_num", "col_text", "col_date"/*, "col_4", "col_5", "col_6"*/]
    }
};

describe('Report Mobile View functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        CardView.__Rewire__('RecordActions', RecordActionsMock);
    });

    afterEach(() => {
        CardView.__ResetDependency__('RecordActions');
    });

    it('test render of component', () => {

        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                allowCardSelection: React.PropTypes.func
            },
            getChildContext: function() {
                return {
                    allowCardSelection: function() {return false;}
                };
            },
            render() {
                return <CardView ref="refCardView" data={fakeReportData_empty.data.results} metadataColumns={fakeReportData_empty.data.columnMetadata}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        expect(cardView.length).toEqual(1);

        var rows = TestUtils.scryRenderedDOMComponentsWithClass(cardView[0], "fieldRow");
        expect(rows.length).toEqual(0);
    });


    it('test render of component with data', () => {

        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                allowCardSelection: React.PropTypes.func
            },
            getChildContext: function() {
                return {
                    allowCardSelection: function() {return false;}
                };
            },
            render() {
                return <CardView ref="refCardView" data={fakeReportData_valid.data.results} metadataColumns={fakeReportData_valid.data.columnMetadata}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        expect(cardView.length).toEqual(1);
        var node = ReactDOM.findDOMNode(cardView[0]);
        var rows = node.getElementsByClassName("fieldRow");
        expect(rows.length).toEqual(1);
    });


    it('test rows are collapsed by default', () => {

        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                allowCardSelection: React.PropTypes.func
            },
            getChildContext: function() {
                return {
                    allowCardSelection: function() {return false;}
                };
            },
            render() {
                return <CardView ref="refCardView" data={fakeReportData_valid.data.results} metadataColumns={fakeReportData_valid.data.columnMetadata}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        var node = ReactDOM.findDOMNode(cardView[0]);
        var rows = node.getElementsByClassName("fieldRow");
        expect(rows[0].className).toContain("collapsed");
    });

    it('test expand row on click', () => {
        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                allowCardSelection: React.PropTypes.func
            },
            getChildContext: function() {
                return {
                    allowCardSelection: function() {return false;}
                };
            },
            render() {
                return <CardView ref="refCardView" data={fakeReportData_valid.data.results} metadataColumns={fakeReportData_valid.data.columnMetadata}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        var node = ReactDOM.findDOMNode(cardView[0]);
        var rows = node.getElementsByClassName("fieldRow");
        TestUtils.Simulate.click(rows[0]);
        expect(rows[0].className).toContain("collapsed");
    });

});
