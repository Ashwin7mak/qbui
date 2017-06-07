import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardView, {__RewireAPI__ as CardViewRewireAPI} from '../../src/components/dataTable/cardView/cardView';
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
        results: {},
        columnMetadata: [],
        columnsMap: new Map()
    }
};
const fakeReportData_valid = {
    data: {
        results: {
            "Record ID#": {
                id: 3,
                value: 1,
                display: "1"
            },
            col_num: {
                "id": 7,
                "value": 1,
                "display": "1"
            },
            col_text: {
                "id": 6,
                "value": "abc",
                "display": "abc"
            },
            col_date:{
                "id":8,
                "value": "2015-01-01",
                "display": "01-01-2015"
            },
            col_4:{
                "id":9,
                "value": 2,
                "display": "2"
            }
        },
        columnMetadata: ["col_num", "col_text", "col_date", "col_4"],
        // map of columns/fields that should be visible (keys are column/field ID, values are currently ignored)
        columnsMap: new Map([[7, "colNumValue"], [6, "colTextValue"], [8, "colDateValue"], [9, "col4Value"]])
    }
};

describe('Report Mobile View functions', () => {
    'use strict';

    var component;
    var TestParent;
    beforeEach(() => {
        CardViewRewireAPI.__Rewire__('RecordActions', RecordActionsMock);
        TestParent = (data = fakeReportData_valid.data) => React.createFactory(React.createClass({
            render() {
                return <CardView ref="refCardView"
                                 data={data.results}
                                 columnsMap={data.columnsMap}
                                 primaryKeyName="col_num"
                                 allowCardSelection={() => {return false;} }
                                 isRowSelected={() => {return false;} }/>;
            }
        }))();
    });


    afterEach(() => {
        CardViewRewireAPI.__ResetDependency__('RecordActions');
    });

    it('test render of component', () => {

        var parent = TestUtils.renderIntoDocument(TestParent(fakeReportData_empty.data.results));
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        expect(cardView.length).toEqual(1);

        var rows = TestUtils.scryRenderedDOMComponentsWithClass(cardView[0], "fieldRow");
        expect(rows.length).toEqual(0);
    });

    it('test render of component with data', () => {

        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        expect(cardView.length).toEqual(1);
        var node = ReactDOM.findDOMNode(cardView[0]);
        var rows = node.getElementsByClassName("fieldRow");
        expect(rows.length).toEqual(1);
    });


    it('test rows are collapsed by default', () => {

        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        var node = ReactDOM.findDOMNode(cardView[0]);
        var rows = node.getElementsByClassName("fieldRow");
        expect(rows[0].className).toContain("collapsed");
    });

    it('expand row button should render when data has more than 3 fields', () => {
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        var node = ReactDOM.findDOMNode(cardView[0]);
        var expandButton = node.getElementsByClassName('card-expander');
        expect(expandButton.length).toEqual(1);
    });

    it('expand row button should not render when data has 3 fields or less', () => {
        var parent = TestUtils.renderIntoDocument(TestParent(fakeReportData_empty.data));
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        var node = ReactDOM.findDOMNode(cardView[0]);
        var expandButton = node.getElementsByClassName('card-expander');
        expect(expandButton.length).toEqual(0);
    });

    it('test expand row on click', () => {
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView);

        var node = ReactDOM.findDOMNode(cardView[0]);
        var expandButton = node.getElementsByClassName('card-expander');

        TestUtils.Simulate.click(expandButton[0]);
        var rows = node.getElementsByClassName('fieldRow');
        expect(rows[0].className).toContain('expanded');
        expect(rows[0].className).not.toContain('collapsed');

    });

    it('test row swiping', () => {
        TestParent = React.createFactory(React.createClass({

            getInitialState() {
                return {cardSelection: false};
            },
            allowCardSelection() {
                return this.state.cardSelection;
            },
            onToggleCardSelection() {
                this.setState({cardSelection: !this.state.cardSelection});
            },
            isRowSelected() {
                return false;
            },
            onSwipe() {

            },
            render() {
                return <CardView ref="refCardView"
                                 data={fakeReportData_valid.data.results}
                                 columnsMap={fakeReportData_valid.data.columnsMap}
                                 primaryKeyName="col_num"
                                 allowCardSelection={this.allowCardSelection }
                                 onToggleCardSelection={this.onToggleCardSelection}
                                 isRowSelected={this.isRowSelected}
                                 onSwipe={this.onSwipe}
                />;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView)[0];

        var node = ReactDOM.findDOMNode(cardView);
        var rows = node.getElementsByClassName("fieldRow");
        TestUtils.Simulate.click(rows[0]);
        expect(rows[0].className).toContain("collapsed");

        // not sure how to simulate these so just call the functions
        // with null event (not needed) and -/+ deltas (right/left)

        // swipe left to reveal row actions
        cardView.swiping(100, true);
        cardView.swipedLeft();

        // close row actions
        cardView.swiping(100, false);
        cardView.swipedRight();

        // swipe right to reveal checkboxes
        cardView.swiping(100, false);
        cardView.swipedRight();

        // close checkboxes
        cardView.swiping(100, true);
        cardView.swipedLeft();
    });
});
