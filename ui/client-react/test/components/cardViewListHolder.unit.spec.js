import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewListHolder from '../../src/components/dataTable/cardView/cardViewListHolder';

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

const CardViewListMock = React.createClass({
    render: function() {
        return (
            <div className="cardViewList">test</div>
        );
    }
});

describe('CardViewListHolder functions', () => {
    'use strict';

    let component;

    beforeEach(() => {
        CardViewListHolder.__Rewire__('CardViewList', CardViewListMock);
    });

    afterEach(() => {
        CardViewListHolder.__ResetDependency__('CardViewList');
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<CardViewListHolder flux={flux} selectedRows={[]} reportData={fakeReportData_loading}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
        expect(cards.length).toEqual(0);
    });

    it('test render of empty component', () => {

        component = TestUtils.renderIntoDocument(<CardViewListHolder flux={flux} selectedRows={[]} reportData={fakeReportData_empty}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
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
                return <CardViewListHolder flux={flux} selectedRows={[]} ref="cardViewListholder" reportData={fakeReportData_valid}
                                     uniqueId="col_num"/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        component = parent.refs.cardViewListholder;

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cardlists = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
        expect(cardlists.length).toEqual(2);

        let cardlist = TestUtils.findRenderedComponentWithType(component, CardViewListMock);
        expect(TestUtils.isCompositeComponent(cardlist)).toBeTruthy();
    });
});
