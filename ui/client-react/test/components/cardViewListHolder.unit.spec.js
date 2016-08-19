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

const singleNodeTreeData = [{
    group:"group1",
    children: [{col_num: 1,
                col_text: "abc",
                col_date: "01-01-2015"}]
}];
const fakeReportData_valid = {
    appId: "1",
    tblId: "2",
    rptId: "3",
    loading:false,
    data: {
        filteredRecords: singleNodeTreeData
    }
};

let flux = {
    actions: {
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
    },
    simulateSwipeRightForSelection: function() {
        this.props.onToggleCardSelection(true, this.props.node);
    },
    simulateSwipeLeftInSelection() {
        this.props.onToggleCardSelection(false);
    },
    simulateClick(props) {
        this.props.node.props = props;
        this.props.onRowClicked(this.props.node);
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
                                           uniqueIdentifier="col_num"/>;
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

    it('test selectrow callback', () => {
        spyOn(flux.actions, 'selectedRows');
        var TestParent = React.createFactory(React.createClass({
            render() {
                return <CardViewListHolder flux={flux} selectedRows={[]} ref="cardViewListholder" reportData={fakeReportData_valid}
                                           uniqueIdentifier="col_num"/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = parent.refs.cardViewListholder;
        let cardlist = TestUtils.findRenderedComponentWithType(component, CardViewListMock);
        expect(TestUtils.isCompositeComponent(cardlist)).toBeTruthy();

        cardlist.simulateSwipeRightForSelection();
        expect(flux.actions.selectedRows).toHaveBeenCalled();
        flux.actions.selectedRows.calls.reset();
    });

    it('test unselectrow callback', () => {
        spyOn(flux.actions, 'selectedRows');
        var TestParent = React.createFactory(React.createClass({
            render() {
                return <CardViewListHolder flux={flux} selectedRows={[]} ref="cardViewListholder" reportData={fakeReportData_valid}
                                           uniqueIdentifier="col_num"/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = parent.refs.cardViewListholder;
        let cardlist = TestUtils.findRenderedComponentWithType(component, CardViewListMock);
        expect(TestUtils.isCompositeComponent(cardlist)).toBeTruthy();

        cardlist.simulateSwipeLeftInSelection();
        expect(flux.actions.selectedRows).toHaveBeenCalled();
        flux.actions.selectedRows.calls.reset();
    });

    it('test rowClick callback', () => {
        let onRowClicked = false;
        let TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {
                    history: ""
                };
            },
            childContextTypes: {
                history: React.PropTypes.object
            },
            getChildContext: function() {
                let self = this;
                return {
                    history: {
                        push(a) {
                            self.setState({history: "history"});
                        }
                    }
                };
            },
            onRowClicked() {
                onRowClicked = true;
            },
            render() {
                return <CardViewListHolder flux={flux} selectedRows={[]} ref="cardViewListholder" reportData={fakeReportData_valid}
                                           uniqueIdentifier="col_num" onRowClicked={this.onRowClicked}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = parent.refs.cardViewListholder;
        let cardlist = TestUtils.findRenderedComponentWithType(component, CardViewListMock);
        expect(TestUtils.isCompositeComponent(cardlist)).toBeTruthy();

        cardlist.simulateClick();
        expect(onRowClicked).toBe(true);
    });
});
