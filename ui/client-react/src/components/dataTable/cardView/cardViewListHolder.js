import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import Loader  from 'react-loader';
import Swipeable from 'react-swipeable';
import Fluxxor from 'fluxxor';
import CardViewList from './cardViewList';
import './cardViewList.scss';
import CardViewFooter from './cardViewFooter';
import CardViewNavigation from './cardViewNavigation';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * A list of CardView items used to render a report at the small breakpoint
 */
const CHECKBOX_COL_WIDTH = 40; // 40px checkbox column can be toggled
const MAX_SWIPE_DISTANCE = 150; // Drag distance when swiping up or down. Applies to report pagination.

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
    swiping(delta, isUpSwipe) {
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
                    tableElem.style.transform = 'translate(0px, ' + (isUpward ? '-' : '') + (delta) + 'px)';
                } else {
                    // If the swipe exceeds drag distance, snap the table, footer and indicator to the top or bottom
                    tableElem.style.transform = 'translate(0px, ' + (isUpward ? '-' : '') + '45px)';
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

        return (<Swipeable className="swipeable"
                       onSwipingUp={(ev, delta) => {this.swiping(ev.target, delta, true);}}
                       onSwipingDown={(ev, delta) => {this.swiping(ev.target, delta, false);}}
                       onSwipedUp={this.swipedUp}
                       onSwipedDown={this.swipedDown}
                       preventDefaultTouchmoveEvent={false}>

                    <div className={cardViewListClasses} style={cardViewListStyle}>
                        {showPreviousButton ?
                            (<CardViewNavigation getPreviousReportPage={this.props.getPreviousReportPage}
                            />) :
                            <div className="spacer"></div>
                        }

                        <CardViewList ref="cardViewList" node={recordNodes}
                                      uniqueIdentifier={this.props.uniqueIdentifier}
                                      groupId=""
                                      groupLevel={-1}
                                      allowCardSelection={this.allowCardSelection}
                                      onToggleCardSelection={this.onToggleCardSelection}
                                      onRowSelected={this.onCardRowSelected}
                                      onRowClicked={this.props.onRowClicked}
                                      isRowSelected={this.isRowSelected}
                                      onEditRecord={this.openRecordForEdit}
                                      onSwipe={this.onSwipe} />

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
        this.refs.cardViewListWrapper.addEventListener("scroll", this.props.onScroll);
    },

    /**
     * tell parent we've stopped scrolling so they can re-display the add record icon
     */
    componentWillUnmount() {
        this.refs.cardViewListWrapper.removeEventListener("scroll", this.props.onScroll);
    },

    /**
     * card edit action callbac, edit in trowser
     * @param recordId
     */
    openRecordForEdit(recordId) {

        const flux = this.getFlux();

        flux.actions.openRecordForEdit(recordId);
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
