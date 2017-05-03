import React, {PropTypes} from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import Locale from '../../../locales/locales';
import Loader  from 'react-loader';
import Swipeable from 'react-swipeable';
import Fluxxor from 'fluxxor';
import CardViewList from './cardViewList';
import './cardViewList.scss';
import CardViewFooter from './cardViewFooter';
import CardViewNavigation from './cardViewNavigation';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import _ from 'lodash';
import {connect} from 'react-redux';
import {openRecord} from '../../../actions/recordActions';
import WindowLocationUtils from '../../../utils/windowLocationUtils';
import {EDIT_RECORD_KEY} from '../../../constants/urlConstants';
import {CONTEXT} from '../../../actions/context';
import EmptyImage from '../../../../../client-react/src/assets/images/empty box graphic.svg';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * A list of CardView items used to render a report at the small breakpoint
 */
const CHECKBOX_COL_WIDTH = 40; // 40px checkbox column can be toggled
const MAX_SWIPE_DISTANCE = 150; // Drag distance when swiping up or down. Applies to report pagination.

export let CardViewListHolder = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        reportData: PropTypes.object.isRequired,
        primaryKeyName: PropTypes.string,
        reportHeader: PropTypes.element,
        selectionActions: PropTypes.element,
        onScroll: PropTypes.func,
        onRowClicked: PropTypes.func,
        noRowsUI: PropTypes.bool,
        searchString: PropTypes.string,
        onAddNewRecord: PropTypes.func
    },

    getInitialState() {
        return {
            allowCardSelection: false,
            rowActionsRowId: -1,
            swiping: false
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
    onToggleCardSelection(allow = true, rowId = null) {

        if (this.state.rowActionsRowId !== -1) {
            return;
        }
        this.setState({allowCardSelection: allow, swiping: false});

        if (!allow) {
            this.props.selectRows([]);
        } else if (rowId) {
            this.props.selectRows([rowId]);
        }
    },

    /**
     * is row selected callback
     */
    isRowSelected(rowId) {
        if (this.props.selectedRows && Array.isArray(this.props.selectedRows)) {
            return this.props.selectedRows.indexOf(rowId) !== -1;
        }
        return false;
    },

    /**
     * card row selection callback
     * @param rowId
     */
    onCardRowSelected(rowId) {
       // const id = row[this.props.primaryKeyName].value;

        let selectedRows = this.props.selectedRows;

        if (selectedRows.indexOf(rowId) === -1) {
            // not already selected, add to selectedRows
            selectedRows.push(rowId);
        } else {
            // already selected, remove from selectedRows
            selectedRows = _.without(selectedRows, rowId);
        }
        this.props.selectRows(selectedRows);
    },

    /** swiping to expose/hide checkbox column */
    onSwipe(delta) {
        if (this.state.rowActionsRowId !== -1) {
            return;
        }
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
    /**
     * Fetch next report page
     */
    swipedUp(e) {
        // Complete swipe action only if footer is visible
        if (this.isElementVisible('cardViewFooter')) {
            this.props.getNextReportPage();
        }
    },

    /**
     * Fetch previous report page
     */
    swipedDown(e) {
        // Complete swipe action only if header is visible
        if (this.isElementVisible('cardViewHeader')) {
            this.props.getPreviousReportPage();
        }
    },

    rowActionsOpened(rowId) {
        this.setState({rowActionsRowId: rowId});
    },

    rowActionsClosed() {
        this.setState({rowActionsRowId: -1});
    },
    /**
     * Checks if the event target element or its parent element matches the supplied classname
     * @param evTarget
     * @param name
     * @returns {boolean}
     */
    doesClassNameMatch(evTarget, name) {
        let targetClassName = evTarget && evTarget.className ? evTarget.className : "";
        if (!targetClassName.includes(name)) {
            // Try the parent element
            targetClassName = evTarget.parentElement && evTarget.parentElement.className ? evTarget.parentElement.className : targetClassName;
        }
        return targetClassName.includes(name);
    },

    /**
     * Handles up or down swiping action for report pagination
     *
     * @param delta - delta from touch starting position
     * @param isUpSwipe - (swiped up relative to starting point)
     */
    swiping(target, delta, isUpSwipe) {
        if (isUpSwipe && this.isElementVisible('cardViewFooter')) {
            // If up swipe, check for visibility of the 'Fetch More' button. If it is visible, display loading indicator,
            // move the table (including button and spinner) up proportional to the swipe distance. If the swipe exceeds
            // drag distance, snap the table, button and spinner to the bottom of screen.
            this.handleVerticalSwipingMovement("footerLoadingIndicator", delta, true);
        } else if (this.isElementVisible('cardViewHeader')) {
            // Down swipe. Check for visibility of 'Fetch Previous' button. If it is visible, display loading indicator,
            // move table, button and indicator down proportional to swipe distance. If swipe exceeds drag distance,
            // snap table, button and spinner to the top.
            this.handleVerticalSwipingMovement("headerLoadingIndicator", delta, false);
        }
    },

    /**
     * Handles vertical swiping for report pagination.
     * When swiping, check for visibility of element with the supplied classname. If said element is visible on screen,
     * display corresponding loading indicator, move the table (including visible element and loading spinner) up or down
     * proportional to the swipe distance. If the swipe exceeds drag distance, snap the table, visible element (header
     * or footer) and spinner to the top/bottom of screen.
     *
     * @param loadingIndicatorElementName - Class name of the loading indicator container
     * @param delta - movement distance per swipe event
     * @param isUpward - indicates upward or downward motion. Negative is for upward motion.
     */
    handleVerticalSwipingMovement(loadingIndicatorElementName, delta, isUpward) {
        // Fetch card view table
        var tableElem = document.getElementsByClassName("cardViewList cardViewListHolder");
        if (tableElem && tableElem.length) {
            tableElem = tableElem[0];
        }
        if (tableElem) {
            // Fetch more or Fetch Previous element is visible, fetch corresponding loading spinner.
            let loadingIndicatorElem = document.getElementsByClassName(loadingIndicatorElementName);
            if (loadingIndicatorElem) {
                loadingIndicatorElem = loadingIndicatorElem[0];
            }
            // Safety check on table element and loading indicator element
            if (loadingIndicatorElem) {
                // Display the loading indicator
                loadingIndicatorElem.style.display = "flex";
                // As long as the swipe is less than drag distance, move the table, header/footer button and spinner
                if (delta < MAX_SWIPE_DISTANCE) {
                    tableElem.style.transform = 'translate(-40px, ' + (isUpward ? '-' : '') + (delta) + 'px)';
                } else {
                    // If the swipe exceeds drag distance, snap the table, footer and indicator to the top or bottom
                    tableElem.style.transform = 'translate(-40px, ' + (isUpward ? '-' : '') + '45px)';
                }
            }
        }
    },

    /**
     * Returns true if the element with the supplied classname is visible on the screen.
     * @param elementClassName Class name of the element for the visibility check.
     */
    isElementVisible(elementClassName) {
        let isVisible = false;
        let elem = document.getElementsByClassName(elementClassName);
        if (elem && elem.length) {
            elem = elem[0];
            let elemTop = elem.getBoundingClientRect().top;
            let elemBottom = elem.getBoundingClientRect().bottom;
            isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        }
        return isVisible;
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

        let showNextButton = !isLoading && !isCountingRecords && !isError && !(recordCount === this.props.pageEnd && this.props.pageStart === 1) && (recordCount !== this.props.pageEnd);
        let showPreviousButton = !isLoading && !isCountingRecords && !isError && (this.props.pageStart !== 1);

        let cardViewListClasses = "cardViewList cardViewListHolder";
        if (this.props.selectedRows && this.props.selectedRows.length) {
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

        return (<Swipeable className="swipeable"
                           onSwipingUp={(ev, delta) => {
                               this.swiping(ev.target, delta, true);
                           }}
                           onSwipingDown={(ev, delta) => {
                               this.swiping(ev.target, delta, false);
                           }}
                           onSwipedUp={this.swipedUp}
                           onSwipedDown={this.swipedDown}
                           preventDefaultTouchmoveEvent={false}>

            <div className={cardViewListClasses} style={cardViewListStyle}>
                {showPreviousButton ?
                    (<CardViewNavigation getPreviousReportPage={this.props.getPreviousReportPage}
                    />) :
                    <div className="spacer"></div>
                }

                <CardViewList ref="cardViewList"
                              node={recordNodes}
                              columns={_.has(this.props, "reportData.data.columns") ? this.props.reportData.data.columns : []}
                              primaryKeyName={this.props.primaryKeyName}
                              groupId=""
                              groupLevel={-1}
                              appId={this.props.reportData.appId}
                              tblId={this.props.reportData.tblId}
                              allowCardSelection={this.allowCardSelection}
                              onToggleCardSelection={this.onToggleCardSelection}
                              onRowClicked={this.props.onRowClicked}
                              isRowSelected={this.isRowSelected}
                              onRowSelected={this.onCardRowSelected}
                              onEditRecord={this.openRecordForEdit}
                              onSwipe={this.onSwipe}
                              onActionsOpened={this.rowActionsOpened}
                              onActionsClosed={this.rowActionsClosed}
                              rowActionsRowId={this.state.rowActionsRowId}/>

                {showNextButton ?
                    (<CardViewFooter getNextReportPage={this.props.getNextReportPage}/>) :
                    <div className="spacer"></div>
                }
            </div>
        </Swipeable>);
    },

    /**
     * tell parent we're scrolling so they can hide the add record icon
     */
    componentDidMount() {
        if (this.refs.cardViewListWrapper) {
            this.refs.cardViewListWrapper.addEventListener("scroll", this.props.onScroll);
        }
    },

    /**
     * tell parent we've stopped scrolling so they can re-display the add record icon
     */
    componentWillUnmount() {
        if (this.refs.cardViewListWrapper) {
            this.refs.cardViewListWrapper.removeEventListener("scroll", this.props.onScroll);
        }
    },

    /**
     * card edit action callback, edit in trowser
     * @param recordId
     */
    openRecordForEdit(recId) {
        if (recId) {
            const {data} = this.getReport();
            if (data) {
                const key = _.has(data, 'keyField.name') ? data.keyField.name : '';
                if (key) {
                    let recordsArray = this.getRecordsArray(data);

                    //  fetch the index of the row in the recordsArray that is being opened
                    const index = _.findIndex(recordsArray, rec => rec[key] && rec[key].value === recId);
                    let nextRecordId = (index < recordsArray.length - 1) ? recordsArray[index + 1][key].value : null;
                    let previousRecordId = index > 0 ? recordsArray[index - 1][key].value : null;

                    this.props.openRecord(recId, nextRecordId, previousRecordId);
                    WindowLocationUtils.pushWithQuery(EDIT_RECORD_KEY, recId);
                }
            }
        }
    },

    addGroupedRecords(arr, groups) {
        if (Array.isArray(groups)) {
            groups.forEach(child => {
                if (child.children) {
                    this.addGroupedRecords(arr, child.children);
                } else {
                    arr.push(child);
                }
            });
        }
    },

    getRecordsArray(data) {
        //  TODO: get from store
        const {filteredRecords, hasGrouping} = data;

        let recordsArray = [];
        if (hasGrouping) {
            // flatten grouped records
            this.addGroupedRecords(recordsArray, filteredRecords);
        } else {
            recordsArray = filteredRecords;
        }
        return recordsArray;
    },

    getReport() {
        return this.props.reportData;
        //return _.find(this.props.report, function(rpt) {
        //    return rpt.id === CONTEXT.REPORT.NAV;
        //});
    },

    /**
     * get text to display below grid if no rows are displayed
     * @returns {*}
     */
    renderNoRowsExist() {

        const hasSearch = this.props.searchString && this.props.searchString.trim().length > 0;
        const recordsName = this.props.selectedTable ? this.props.selectedTable.name.toLowerCase() : Locale.getMessage("records.plural");
        const recordName = this.props.selectedTable ? this.props.selectedTable.tableNoun.toLowerCase() : Locale.getMessage("records.singular");
        return (
            <div className="noRowsExist">

                <div className="noRowsIconLine">
                    <img className="noRowsIcon animated zoomInDown" alt="No Rows" src={EmptyImage} />
                </div>

                <div className="noRowsText">
                    {hasSearch ? <div className="searchNoRows"><I18nMessage message="grid.no_filter_matches" recordsName={recordsName} recordName={recordName}/></div> :
                        <div className="cardViewCreateOne">
                            <I18nMessage message="grid.no_rows_but" recordsName={recordsName}/>
                            <a href="#" onClick={this.props.onAddNewRecord}><I18nMessage message="grid.no_rows_create_link"/></a>...
                        </div>}
                </div>
            </div>);
    },

    render() {
        let results = this.props.reportData && this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];

        if (!this.props.noRowsUI || this.props.reportData.loading || results && results.length > 0) {
            return (
                <div className="reportTable">

                    <div className="tableLoaderContainer" ref="cardViewListWrapper">
                        <Loader loaded={!this.props.reportData.loading}
                                options={SpinnerConfigurations.CARD_VIEW_REPORT}>
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
        } else {
            return this.renderNoRowsExist();
        }
    }
});

const mapStateToProps = (state) => {
    return {
        report: state.report,
        searchString: state.search && state.search.searchInput
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        openRecord: (recId, nextId, prevId) => {
            dispatch(openRecord(recId, nextId, prevId));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CardViewListHolder);
