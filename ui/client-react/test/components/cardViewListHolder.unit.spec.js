import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardViewListHolder from '../../src/components/dataTable/cardView/cardViewListHolder';
import CardViewNavigation from '../../src/components/dataTable/cardView/cardViewNavigation';
import CardViewFooter from '../../src/components/dataTable/cardView/cardViewFooter';

const fakeReportNavigationData = {
    valid: {
        pageStart: 2,
        pageEnd: 10,
        recordsCount: 1000,
        getPreviousReportPage: null,
        getNextReportPage: null
    },
    noPrevious: {
        pageStart: 1,
        pageEnd: 20,
        recordsCount: 1000,
        getPreviousReportPage: null,
        getNextReportPage: null
    },
    noNext: {
        pageStart: 2,
        pageEnd: 1000,
        recordsCount: 20,
        getPreviousReportPage: null,
        getNextReportPage: null
    },
    noPrevAndNext: {
        pageStart: 1,
        pageEnd: 1000,
        recordsCount: 20,
        getPreviousReportPage: null,
        getNextReportPage: null
    }
};

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

    it('test render of CardViewNavigation component', () => {
        component = TestUtils.renderIntoDocument(<CardViewNavigation recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                     pageStart={fakeReportNavigationData.valid.pageStart}
                                                                     pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                     getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                     getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var reportNavigation = ReactDOM.findDOMNode(component);
        expect(reportNavigation).toBeDefined();
    });

    it('test render of CardViewFooter navigation component', () => {
        component = TestUtils.renderIntoDocument(<CardViewFooter recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                 pageStart={fakeReportNavigationData.valid.pageStart}
                                                                 pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                 getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                 getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var reportNavigation = ReactDOM.findDOMNode(component);
        expect(reportNavigation).toBeDefined();
    });

    it('test next link and previous link are generated', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder flux={flux}
                                                                     selectedRows={[]}
                                                                     reportData={fakeReportData_loading}
                                                                   recordsCount={fakeReportNavigationData.valid.recordsCount}
                                                                   pageStart={fakeReportNavigationData.valid.pageStart}
                                                                   pageEnd={fakeReportNavigationData.valid.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.valid.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.valid.getNextReportPage}/>);
        var node = ReactDOM.findDOMNode(component);
        var previousButton = node.getElementsByClassName("cardViewFooter");
        expect(previousButton).toBeDefined();

        node = ReactDOM.findDOMNode(component);
        var nextButton = node.getElementsByClassName("cardViewHeader");
        expect(nextButton).toBeDefined();
    });

    it('test next link and previous link are NOT generated', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder flux={flux}
                                                                     selectedRows={[]}
                                                                     reportData={fakeReportData_loading}
                                                                     recordsCount={fakeReportNavigationData.noPrevAndNext.recordsCount}
                                                                   pageStart={fakeReportNavigationData.noPrevAndNext.pageStart}
                                                                   pageEnd={fakeReportNavigationData.noPrevAndNext.pageEnd}
                                                                   getPreviousReportPage={fakeReportNavigationData.noPrevAndNext.getPreviousReportPage}
                                                                   getNextReportPage={fakeReportNavigationData.noPrevAndNext.getNextReportPage}/>);
        var pageButton = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "previousReportPage";
        });
        expect(pageButton.length).toBe(0);
        var nextPage = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "nextReportPage";
        });
        expect(nextPage.length).toBe(0);
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
