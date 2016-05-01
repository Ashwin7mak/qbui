import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewList from '../../src/components/dataTable/cardView/cardViewList';

const fakeReportData_loading = {
    loading: true
};

const fakeReportData_empty = {
    loading: false,
    data: {
        results: [],
        columnMetadata: []
    }
};

const fakeReportData_valid = {
    loading:false,
    data: {
        filteredRecords: [
            {
                col_num: 1,
                col_text: "abc",
                col_date: "01-01-2015"
            }]
    }
};

let flux = {
    actions: {
        getFilteredRecords: function() {
            return;
        },
        selectedRows: function() {
            return;
        }
    }
};

const CardViewMock = React.createClass({
    render: function() {
        let allowSelection = this.props.allowCardSelection();
        let selected = this.props.isRowSelected(this.props.data);
        return (
            <div className="cardView">test</div>
        );
    },
    simulateSwipeRightForSelection() {
        this.props.onToggleCardSelection(true, this.props.data);
    },
    simulateSwipeLeftInSelection() {
        this.props.onToggleCardSelection(false);
    },
    simulateClick() {
        this.props.onRowClicked(this.props.data);
    },
});

describe('CardViewList functions', () => {
    'use strict';

    let component;

    beforeEach(() => {
        CardViewList.__Rewire__('CardView', CardViewMock);
    });

    afterEach(() => {
        CardViewList.__ResetDependency__('CardView');
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<CardViewList flux={flux} selectedRows={[]} reportData={fakeReportData_loading}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardView");
        expect(cards.length).toEqual(0);
    });

    it('test render of empty component', () => {

        component = TestUtils.renderIntoDocument(<CardViewList flux={flux} selectedRows={[]} reportData={fakeReportData_empty}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardView");
        expect(cards.length).toEqual(0);
    });

    it('test render of single cardview component', () => {

        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                history: React.PropTypes.object
            },
            getChildContext: function() {
                return {
                    history: {push() {return;}}
                };
            },
            render() {
                return <CardViewList flux={flux} selectedRows={[]} ref="cardViewList" reportData={fakeReportData_valid}
                                     uniqueId="col_num"/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        component = parent.refs.cardViewList;

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardView");
        expect(cards.length).toEqual(1);

        let card = TestUtils.findRenderedComponentWithType(component, CardViewMock);
        expect(TestUtils.isCompositeComponent(card)).toBeTruthy();

        card.simulateSwipeRightForSelection();
        card.simulateSwipeLeftInSelection();
        card.simulateClick();
    });
});
