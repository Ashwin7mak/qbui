import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {CardViewListHolder, __RewireAPI__ as CardViewListHolderdRewireAPI} from '../../src/components/dataTable/cardView/cardViewListHolder';
import {EDIT_RECORD_KEY} from '../../src/constants/urlConstants';

let component;

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

const fakeReportData_fetchMoreOnly = {
    reportData: {
        loading: false,
        countingTotalRecords: false,
        data: {
            recordsCount: 100
        }
    },
    pageEnd: 50,
    pageStart: 1
};

const fakeReportData_fetchPreviousOnly = {
    reportData: {
        loading: false,
        countingTotalRecords: false,
        data: {
            recordsCount: 100
        }
    },
    pageEnd: 100,
    pageStart: 50
};

const fakeReportData_fetchMoreAndPrevious = {
    reportData: {
        loading: false,
        countingTotalRecords: false,
        data: {
            recordsCount: 1000
        }
    },
    pageEnd: 100,
    pageStart: 51
};

const fakeReportData_noNagivationButtons = {
    reportData: {
        loading: false,
        countingTotalRecords: false,
        data: {
            recordsCount: 10
        }
    },
    pageEnd: 10,
    pageStart: 1
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
        columns: [{id:6, field:"Text"}],
        filteredRecords: singleNodeTreeData
    }
};


const CardViewListMock = React.createClass({
    render: function() {
        return (
            <div className="cardViewList">test</div>
        );
    },
    simulateSwipeRightForSelection: function() {
        this.props.onToggleCardSelection(true, {col_num: 1, col_text: "abc", col_date: "01-01-2015"});
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

    beforeEach(() => {
        CardViewListHolderdRewireAPI.__Rewire__('CardViewList', CardViewListMock);
    });

    afterEach(() => {
        CardViewListHolderdRewireAPI.__ResetDependency__('CardViewList');
    });

    it('test render of loading component', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[]} primaryKeyName="col_num" reportData={fakeReportData_loading}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
        expect(cards.length).toEqual(0);
    });

    it('test render of empty component', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[]} primaryKeyName="col_num" reportData={fakeReportData_empty} noRowsUI={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
        expect(cards.length).toEqual(0);

        let noRows = TestUtils.scryRenderedDOMComponentsWithClass(component, "noRowsExist");
        expect(noRows.length).toEqual(1);

        let noRowsText = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewCreateOne");
        expect(noRowsText.length).toEqual(1);
    });

    it('test render of empty component with search string', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[]} primaryKeyName="col_num" reportData={fakeReportData_empty} searchString="xxx" noRowsUI={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let cards = TestUtils.scryRenderedDOMComponentsWithClass(component, "cardViewList");
        expect(cards.length).toEqual(0);

        let noRows = TestUtils.scryRenderedDOMComponentsWithClass(component, "noRowsExist");
        expect(noRows.length).toEqual(1);

        let searchNoRowsText = TestUtils.scryRenderedDOMComponentsWithClass(component, "searchNoRows");
        expect(searchNoRowsText.length).toEqual(1);
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
                return <CardViewListHolder selectedRows={[]} ref="cardViewListholder" reportData={fakeReportData_valid}
                                           primaryKeyName="col_num"/>;
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

    it('test render of first paginated page, fetch more button only', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[]}
                                                                     primaryKeyName="col_num"
                                                                     reportData={fakeReportData_fetchMoreOnly.reportData}
                                                                     pageEnd={fakeReportData_fetchMoreOnly.pageEnd}
                                                                     pageStart={fakeReportData_fetchMoreOnly.pageStart}/>);
        var node = ReactDOM.findDOMNode(component);
        var nextButton = node.getElementsByClassName("cardViewFooter");
        expect(nextButton).toBeDefined();
    });

    it('test render of last paginated page, fetch previous button only', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[]}
                                                                     primaryKeyName="col_num"
                                                                     reportData={fakeReportData_fetchPreviousOnly.reportData}
                                                                     pageEnd={fakeReportData_fetchPreviousOnly.pageEnd}
                                                                     pageStart={fakeReportData_fetchPreviousOnly.pageStart}/>);
        var node = ReactDOM.findDOMNode(component);
        var previousButton = node.getElementsByClassName("cardViewHeader");
        expect(previousButton).toBeDefined();
    });


    it('test render of second paginated page, next and previous button to be rendered', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[]}
                                                                     primaryKeyName="col_num"
                                                                     reportData={fakeReportData_fetchMoreAndPrevious.reportData}
                                                                     pageEnd={fakeReportData_fetchMoreAndPrevious.pageEnd}
                                                                     pageStart={fakeReportData_fetchMoreAndPrevious.pageStart}/>);
        var node = ReactDOM.findDOMNode(component);
        var moreButton = node.getElementsByClassName("cardViewFooter");
        expect(moreButton).toBeDefined();

        var previousButton = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "cardViewHeader";
        });
        expect(previousButton.length).toBe(0);
    });


    it('test fetch more and fetch previous buttons are NOT generated', () => {
        component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[]}
                                                                     primaryKeyName="col_num"
                                                                     reportData={fakeReportData_noNagivationButtons.reportData}
                                                                     pageStart={fakeReportData_noNagivationButtons.pageStart}
                                                                     pageEnd={fakeReportData_noNagivationButtons.pageEnd}/>);
        var previousButton = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "cardViewHeader";
        });
        expect(previousButton.length).toBe(0);
        var moreButton = TestUtils.findAllInRenderedTree(component, function(inst) {
            return TestUtils.isDOMComponent(inst) && inst.id === "cardViewFooter";
        });
        expect(moreButton.length).toBe(0);
    });

    it('test selectrow callback', () => {
        const props = {selectedRows: [],
            ref:"cardViewListholder",
            reportData:{fakeReportData_valid},
            primaryKeyName:"col_num",
            selectRows: () => {}
        };
        spyOn(props, "selectRows");
        var TestParent = React.createFactory(React.createClass({
            render() {
                return <CardViewListHolder {...props}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = parent.refs.cardViewListholder;
        let cardlist = TestUtils.findRenderedComponentWithType(component, CardViewListMock);
        expect(TestUtils.isCompositeComponent(cardlist)).toBeTruthy();

        cardlist.simulateSwipeRightForSelection();
        expect(props.selectRows).toHaveBeenCalled();
        props.selectRows.calls.reset();
    });

    it('test unselectrow callback', () => {
        const props = {selectedRows: [],
            ref:"cardViewListholder",
            reportData:{fakeReportData_valid},
            primaryKeyName:"col_num",
            selectRows: () => {}
        };
        spyOn(props, "selectRows");
        var TestParent = React.createFactory(React.createClass({
            render() {
                return <CardViewListHolder {...props}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = parent.refs.cardViewListholder;
        let cardlist = TestUtils.findRenderedComponentWithType(component, CardViewListMock);
        expect(TestUtils.isCompositeComponent(cardlist)).toBeTruthy();

        cardlist.simulateSwipeLeftInSelection();
        expect(props.selectRows).toHaveBeenCalled();
        props.selectRows.calls.reset();
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
                return <CardViewListHolder selectedRows={[]} ref="cardViewListholder" reportData={fakeReportData_valid}
                                           primaryKeyName="col_num" onRowClicked={this.onRowClicked}/>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = parent.refs.cardViewListholder;
        let cardlist = TestUtils.findRenderedComponentWithType(component, CardViewListMock);
        expect(TestUtils.isCompositeComponent(cardlist)).toBeTruthy();

        cardlist.simulateClick();
        expect(onRowClicked).toBe(true);
    });

    // This function is unit tested directly because it is passed down to a child component rather than rendered in this component
    describe('openRecordForEdit', () => {
        const WindowHistoryUtils = {pushWithQuery() {}};
        const mockParentMethods = {openRecord() {}};

        beforeEach(() => {
            spyOn(WindowHistoryUtils, 'pushWithQuery');
            spyOn(mockParentMethods, 'openRecord');

            CardViewListHolderdRewireAPI.__Rewire__('WindowHistoryUtils', WindowHistoryUtils);

            component = TestUtils.renderIntoDocument(<CardViewListHolder reportData={{}} openRecord={mockParentMethods.openRecord} />);
        });

        afterEach(() => {
            CardViewListHolderdRewireAPI.__ResetDependency__('WindowLocationUtils');
        });

        it('does not navigate if a record id is not provided', () => {
            component.openRecordForEdit();

            expect(WindowHistoryUtils.pushWithQuery).not.toHaveBeenCalled();
            expect(mockParentMethods.openRecord).not.toHaveBeenCalled();
        });

        it('returns undefined if the record is not in the array of records for the report', () => {
            component.openRecordForEdit(2);

            expect(WindowHistoryUtils.pushWithQuery).not.toHaveBeenCalled();
            expect(mockParentMethods.openRecord).not.toHaveBeenCalled();
        });

        it('navigates to the record if present in the data and invokes the openRecord callback', () => {
            spyOn(component, 'getReport').and.returnValue({data: {keyField: {name: 'Record ID#'}}});
            spyOn(component, 'getRecordsArray').and.returnValue([{'Record ID#': {value: 1}}]);

            component.openRecordForEdit(1);

            expect(WindowHistoryUtils.pushWithQuery).toHaveBeenCalledWith(EDIT_RECORD_KEY, 1);
            expect(mockParentMethods.openRecord).toHaveBeenCalledWith(1, null, null);
        });
    });

    // This function is unit tested directly because it is passed down to a child component rather than rendered in this component
    describe('isRowSelected', () => {
        it('returns true if the row is in the list of selected rows', () => {
            component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[1, 2]} reportData={{}}/>);

            expect(component.isRowSelected(1)).toEqual(true);
        });

        it('returns false if the row is in the list of selected rows', () => {
            component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={[1, 2]} reportData={{}}/>);

            expect(component.isRowSelected(3)).toEqual(false);
        });

        it('returns false if selectedRows is null', () => {
            component = TestUtils.renderIntoDocument(<CardViewListHolder selectedRows={null} reportData={{}}/>);

            expect(component.isRowSelected(1)).toEqual(false);
        });

    });
});
