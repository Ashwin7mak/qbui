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
                    allowCardSelection: () => {return false;}
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
                    allowCardSelection: () => {return false;}
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
                    allowCardSelection: () => {return false;}
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
                    allowCardSelection: () => {return true;}
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

    it('test row swiping', () => {
        var TestParent = React.createFactory(React.createClass({

            getInitialState() {
                return {cardSelection: false} ;
            },
            childContextTypes: {
                allowCardSelection: React.PropTypes.func,
                onToggleCardSelection: React.PropTypes.func
            },
            getChildContext: function() {

                return {
                    allowCardSelection: () => {return this.state.cardSelection;},
                    onToggleCardSelection: () => {this.setState({cardSelection: !this.state.cardSelection});}
                };
            },
            render() {
                return <CardView ref="refCardView" data={fakeReportData_valid.data.results} metadataColumns={fakeReportData_valid.data.columnMetadata}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        var cardView = TestUtils.scryRenderedComponentsWithType(parent.refs.refCardView, CardView)[0];

        var node = ReactDOM.findDOMNode(cardView);
        var rows = node.getElementsByClassName("fieldRow");
        TestUtils.Simulate.click(rows[0]);
        expect(rows[0].className).toContain("collapsed");

        // not sure how to simulate these so just call the functions

        // swipe left to reveal row actions
        cardView.swiping(null, -100);
        cardView.swipedLeft();
        cardView.swiped();

        // close row actions
        cardView.swiping(null, 100);
        cardView.swipedRight();
        cardView.swiped();

        // swipe right to reveal checkboxes
        cardView.swiping(null, 100);
        cardView.swipedRight();
        cardView.swiped();

        var checkbox = node.getElementsByTagName("input");
        TestUtils.Simulate.click(checkbox[0]);

        // close checkboxes
        cardView.swiping(null, -100);
        cardView.swipedLeft();
        cardView.swiped();
    });
});
