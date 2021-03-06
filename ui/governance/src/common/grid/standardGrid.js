import React, {Component, PropTypes} from "react";
import _ from "lodash";
import * as Table from "reactabular-table";
import {connect} from "react-redux";
import QbHeaderCell from "../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell";
import QbRow from "../../../../client-react/src/components/dataTable/qbGrid/qbRow";
import QbCell from "../../../../client-react/src/components/dataTable/qbGrid/qbCell";
import HeaderMenuColumnTransform from "./transforms/headerMenuColumnTransform";
import SortMenuItems from "./headerMenu/sort/sortMenuItems";
import * as StandardGridActions from "./standardGridActions";
import {pageLoadTime, gridRefreshTime} from "../../analytics/performanceTimingActions";
import StandardGridToolbar from "./toolbar/StandardGridToolbar";
import EmptyImage from 'APP/assets/images/empty box graphic.svg';
import Locale from "../../../../reuse/client/src/locales/locale";
import WindowPerformanceUtils from "../../../../reuse/client/src/utils/windowPerformanceUtils";
import QbLoader from "../../../../reuse/client/src/components/loader/QbLoader";
import constants from "../constants/StandardGridConstants";
import "../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss";
import "./standardGrid.scss";

// Helper function to return additional props to add to a row element
const onRowFn = (row) => {
    return {
        className: 'qbRow'
    };
};

export class StandardGrid extends Component {
    constructor(props) {
        super(props);
        this.transforms = this.props.columnTransformsClasses.map((transformClass, index) => new transformClass(this, this.props.columnTransformProps[index]));
    }

    getColumns = () => {
        return _.reduce(this.transforms, (columns, transform) => transform.apply(columns), this.props.columns);
    };

    getUniqueRowKey = ({rowData}) => {
        return `${this.props.id}-row-${rowData[this.props.rowKey]}`;
    };

    /**
     * stick the header and sticky first column when the grid scrolls
     * If the sticky column needs to be implemented, check out the code from qbGrid.js in client-react
     */
    handleScroll = () => {
        let scrolled = this.tableRef;
        if (scrolled) {
            let currentTopScroll = scrolled.scrollTop;

            // move the headers down to their original positions
            let stickyHeaders = scrolled.getElementsByClassName('qbHeaderCell');
            for (let i = 0; i < stickyHeaders.length; i++) {
                let translate = "translate(0," + currentTopScroll + "px)";
                stickyHeaders[i].style.transform = translate;
            }
        }
    };

    bodyRef = (body) => {
        this.tableRef = body && body.getRef().parentNode;
    };

    componentWillUpdate() {
        WindowPerformanceUtils.markTime(this.props.id + 'GridRefreshStart');
    }

    /**
     * Calculates the time from GridRefreshStart for the current grid
     * @returns {*} Null (if performance.mark not supported), Number in millis if supported
     */
    calculateGridRefreshTime = () => {
        let time = null;
        if (WindowPerformanceUtils.markTime(this.props.id + 'GridRefreshEnd')) {
            let measureName = this.props.id + 'GridRefreshTime';
            WindowPerformanceUtils.measureTimeDiff(
                measureName, this.props.id + 'GridRefreshStart', this.props.id + 'GridRefreshEnd'
            );
            time = WindowPerformanceUtils.getDurationFromLastEntry(measureName);
        }
        return time;
    };

    componentDidUpdate = () => {
        if (this.props.items) {
            this.props.pageLoadTime();
            let refreshTime = this.calculateGridRefreshTime();
            if (refreshTime) {
                this.props.gridRefreshTime(refreshTime);
            }
        }
    };

    /**
     * Render the grid when items exist
     */
    renderItemsExist = () => {
        return (
            <div className="gridContainer">
                <Table.Provider
                    className="qbGrid"
                    columns={this.getColumns()}
                    onScroll={this.handleScroll}
                    components={{
                        header: {
                            cell: this.props.headerRenderer
                        },
                        body: {
                            row: QbRow,
                            cell: this.props.cellRenderer
                        }
                    }}
                >
                    <Table.Header className="qbHeader"/>
                    {/*If there is no data at all, render an empty grid, else render this.props.items*/}
                    <Table.Body
                        className="qbTbody"
                        rows={_.isNull(this.props.items) ? [] : this.props.items}
                        rowKey={this.getUniqueRowKey.bind(this)}
                        onRow={onRowFn}
                        ref={this.bodyRef}
                    />
                </Table.Provider>
            </div>
        );
    };

    /**
     * Renders the no items found UI
     */
    renderNoItemsExist = () => {
        return (
            <div className="noItemsExist">
                <div className="noItemsIconLine">
                    <img className="noRowsIcon animated zoomInDown" alt="No Rows" src={EmptyImage} />
                </div>
                <div className="noRowsText">
                    {Locale.getMessage(
                        `${this.props.noItemsFound}`, {
                            items: this.props.itemTypePlural,
                            item: this.props.itemTypeSingular
                        })
                    }
                </div>
            </div>
        );
    };

    /**
     * The main render function for the StandardGrid component
     * - Show the grid if items exist
     * - else... show the noItemsExist UI
     */
    render() {
        let isGridNotLoaded = _.isNull(this.props.items); //If the array is null(before API call)
        let isGridEmpty = _.isEmpty(this.props.items); // If the array is empty (after API call but items are not yet rendered)
        let isGridLoading = isGridNotLoaded && isGridEmpty;

        const classNames = "gridWrapper" + (isGridLoading ? " gridLoading" : "");

        return (
            <div className={classNames}>
                <QbLoader isLoading={isGridLoading} width={"100px"} height={"100px"} className="standardGridLoader" waitTime={constants.GRID_LOADER_TIMEOUT} >
                    <StandardGridToolbar
                        id={this.props.id}
                        doUpdate={this.props.doUpdate}
                        shouldFacet={this.props.shouldFacet}
                        shouldSearch={this.props.shouldSearch}
                        facetFields={this.props.facetFields}
                        itemTypePlural={this.props.itemTypePlural}
                        itemTypeSingular={this.props.itemTypeSingular}
                        itemsPerPage={this.props.itemsPerPage}
                    />
                    {/*If the array is empty(no data), we render {renderNoItemsExist} or if we have data, render {renderItemsExist}*/}
                    {isGridEmpty ? this.renderNoItemsExist() : this.renderItemsExist()}
                </QbLoader>
            </div>

        );
    }
    }

StandardGrid.propTypes = {

    /**
     * ID of the current Grid. Assume that there can be multiple grids in a page
     */
    id: PropTypes.string.isRequired,

    /**
     * The type of item we are displaying. For example "Users"/"User"
     */
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string,

    /**
     * The Columns for the Grid
     */
    columns: PropTypes.array.isRequired,

    /**
     * The Items to display
     */
    items: PropTypes.array.isRequired,

    /**
     * Every row needs a unique key. For example, user item has the userID
     */
    rowKey: PropTypes.string.isRequired,

    /**
     * Following two properties lets you transform the columns
     * This can be used to add the sort menu item for example
     */
    columnTransforms: PropTypes.array,
    columnTransformProps: PropTypes.array,

    /**
     * Action to perform when any update action is triggered.
     * This is a callback the client provides which is overriden to do update
     */
    doUpdate: PropTypes.func.isRequired,

    /**
     * Whether to provide a search box to filter the grid
     */
    shouldSearch: PropTypes.bool,

    /**
     * Whether to Facet in this grid or not
     */
    shouldFacet: PropTypes.bool,

    /**
     * if should facet then the Facet Fields to display needs to be passed
     */
    facetFields: PropTypes.array,

    /**
     *  Number of items to be displayed in a page in the grid
     */
    itemsPerPage: PropTypes.number,

    /**
     *  The text to display if there are no items found
     */
    noItemsFound: PropTypes.string,

    /**
     *  Function that returns the page load time (as a number)
     */
    pageLoadTime: PropTypes.func,

    /**
     *  Function that returns the user grid refresh time (as a number)
     */
    gridRefreshTime: PropTypes.func,

    /**
     * Header cell to be passed in to make QbGrid more reusable.
     * Use QbHeaderCell for a default non-draggable header.
     * Use DraggableQbHeaderCell for a draggable header. (Note that you must include DragDropContext to be able to use). */
    headerRenderer: PropTypes.func,

    /**
     * Cell renderer.
     */
    cellRenderer: PropTypes.func
};

StandardGrid.defaultProps = {
    items: null,
    /**
     * Provide the Header Menu Transformations.
     * You can append more menu like the "Sort" to the column
     */
    columnTransformsClasses: [HeaderMenuColumnTransform],
    columnTransformProps: [
        {
            menuItemsClasses: [SortMenuItems]
        }
    ],
    shouldFacet: true,
    facetFields:[],
    shouldSearch: true,
    headerRenderer: QbHeaderCell,
    cellRenderer: QbCell
};

const mapStateToProps = (state, props) => {
    let gridState = state.Grids[props.id] || {};
    return {
        sortFids: gridState.sortFids || [],
        items : gridState.items
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    setSort(sortFid, asc, remove) {
        dispatch(StandardGridActions.setSort(props.id, sortFid, asc, remove));
        dispatch(StandardGridActions.doUpdate(props.id, props.doUpdate));
    },
    pageLoadTime: () => {
        dispatch(pageLoadTime((WindowPerformanceUtils.now())));
    },
    gridRefreshTime: (time) => {
        dispatch(gridRefreshTime(time));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StandardGrid);
