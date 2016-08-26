import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import Loader  from 'react-loader';
import Fluxxor from 'fluxxor';
import CardViewList from './cardViewList';
import './cardViewList.scss';
import CardViewFooter from './cardViewFooter'
import CardViewNavigation from './cardViewNavigation'

let FluxMixin = Fluxxor.FluxMixin(React);
/**
 * A list of CardView items used to render a report at the small breakpoint
 */
const CHECKBOX_COL_WIDTH = 40; // 40px checkbox column can be toggled

let CardViewListHolder = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        reportData: React.PropTypes.object.isRequired,
        uniqueIdentifier: React.PropTypes.string,
        reportHeader: React.PropTypes.element,
        selectionActions: React.PropTypes.element,
        onScroll: React.PropTypes.func,
        onRowClicked: React.PropTypes.func
    },

    getInitialState() {
        return {
            allowCardSelection: false,
            swiping:false
        };
    },

    /**
     * are we in card selection mode
     */
    allowCardSelection() {
        return this.state.allowCardSelection;
    },

    /**
     * card has requested card selection (by swiping right)
     * or has finished card selection (by swiping left to hide selection column)
     */
    onToggleCardSelection(allow = true, rowData = null) {
        this.setState({allowCardSelection: allow, swiping:false});

        const flux = this.getFlux();
        if (!allow) {
            flux.actions.selectedRows([]);
        } else if (rowData) {
            this.onCardRowSelected(rowData); // pre-select the card that started selection
        }
    },

    /**
     * is row selected callback
     */
    isRowSelected(row) {
        return this.props.selectedRows.indexOf(row[this.props.uniqueIdentifier]) !== -1;
    },

    /**
     * card row selection callback
     * @param row
     */
    onCardRowSelected(row) {

        const flux = this.getFlux();

        const id = row[this.props.uniqueIdentifier];

        let selectedRows = this.props.selectedRows;

        if (selectedRows.indexOf(id) === -1) {
            // not already selected, add to selectedRows
            selectedRows.push(row[this.props.uniqueIdentifier]);
        } else {
            // already selected, remove from selectedRows
            selectedRows = _.without(selectedRows, id);
        }
        flux.actions.selectedRows(selectedRows);
    },

    /** swiping to expose/hide checkbox column */
    onSwipe(delta) {
        // delta is number of pixels swiped to the LEFT!

        let horizontalOffset = this.state.allowCardSelection ? 0 : -CHECKBOX_COL_WIDTH;
        horizontalOffset -= delta;

        // constrain movement to between closed and opened values
        horizontalOffset = Math.min(horizontalOffset, 0);
        horizontalOffset = Math.max(horizontalOffset, -CHECKBOX_COL_WIDTH);

        this.setState({
            horizontalOffset,
            swiping: true
        });

    },

    getRows(results) {
        let isLoading = false;
        let isCountingRecords = false;
        let isError = false;
        // This is the count of all records that apply to this report
        let recordCount = 0;

        if (this.props.reportData) {
            if (this.props.reportData.loading) {
                isLoading = this.props.reportData.loading;
            }
            if (this.props.reportData.countingTotalRecords) {
                isCountingRecords = this.props.reportData.countingTotalRecords;
            }
            if (this.props.reportData.error) {
                isError = true;
            }
            if (this.props.reportData.data) {
                if (!isCountingRecords && this.props.reportData.data.recordsCount) {
                    recordCount = this.props.reportData.data.recordsCount;
                }
            }
        }

        let showNextButton = !isLoading && !isCountingRecords && !(recordCount === this.props.pageEnd && this.props.pageStart === 1) && !isError;
        let showPreviousButton = showNextButton && this.props.pageStart !== 1;

        let cardViewListClasses = "cardViewList cardViewListHolder";
        if (this.props.selectedRows.length) {
            cardViewListClasses += " selectedRows";
        }
        if (this.state.allowCardSelection) {
            cardViewListClasses += " allowCardSelection";
        }
        const records = this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];
        //introduce a top level group to normalize tree data.
        let recordNodes = {};
        recordNodes.children = records;

        let cardViewListStyle = {};
        if (this.state.swiping) {
            cardViewListClasses += " swiping";
            cardViewListStyle = {
                transform: "translate3d(" + this.state.horizontalOffset + "px,0,0)",
                WebkitTransform: "translate3d(" + this.state.horizontalOffset + "px,0,0)"
            };
        }


        return (
            <div className={cardViewListClasses} style={cardViewListStyle}>
                {showPreviousButton ?
                    (<CardViewNavigation getPreviousReportPage={this.props.getPreviousReportPage}
                    />) :
                    <div className="spacer"></div>
                }

                <CardViewList ref="cardViewList" node={recordNodes}
                              groupId=""
                              groupLevel={-1}
                              allowCardSelection={this.allowCardSelection}
                              onToggleCardSelection={this.onToggleCardSelection}
                              onRowSelected={this.onCardRowSelected}
                              onRowClicked={this.props.onRowClicked}
                              isRowSelected={this.isRowSelected}
                              onSwipe={this.onSwipe} />

                {showNextButton ?
                    (<CardViewFooter getNextReportPage={this.props.getNextReportPage}
                    />) :
                    <div className="spacer"></div>
                }
            </div>);
    },

    /**
     * tell parent we're scrolling so they can hide the add record icon
     */
    componentDidMount() {
        this.refs.cardViewListWrapper.addEventListener("scroll", this.props.onScroll);
    },

    /**
     * tell parent we've stopped scrolling so they can re-display the add record icon
     */
    componentWillUnmount() {
        this.refs.cardViewListWrapper.removeEventListener("scroll", this.props.onScroll);
    },

    render() {
        let results = this.props.reportData && this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];


        return (
            <div className="reportTable">

                <div className="tableLoaderContainer" ref="cardViewListWrapper">
                    <Loader loaded={!this.props.reportData.loading}>
                        {results ?
                            this.getRows(results) :
                            <div className="noData"><I18nMessage message={'grid.no_data'}/></div>}
                    </Loader>
                    { //keep empty placeholder when loading to reduce reflow of space, scrollbar changes
                        this.props.reportData.loading ? <div className="loadedContent"></div> : null
                    }
                </div>
            </div>
        );
    }
});

export default CardViewListHolder;
