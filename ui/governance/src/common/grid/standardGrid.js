import React, {Component, PropTypes} from "react";
import _ from "lodash";
import "../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss";
import "./standardGrid.scss";
import * as Table from "reactabular-table";
import {connect} from "react-redux";
import QbHeaderCell from "../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell";
import QbRow from "../../../../client-react/src/components/dataTable/qbGrid/qbRow";
import QbCell from "../../../../client-react/src/components/dataTable/qbGrid/qbCell";
import HeaderMenuColumnTransform from "./transforms/headerMenuColumnTransform";
import SortMenuItems from "./headerMenu/sort/sortMenuItems";
import * as StandardGridActions from "./standardGridActions";
import StandardGridToolbar from "./toolbar/StandardGridToolbar";

// Sub-component pieces we will be using to override React Tabular's default components
const tableSubComponents = {
    header: {
        cell: QbHeaderCell
    },
    body: {
        row: QbRow,
        cell: QbCell
    }
};

// Helper function to return additional props to add to a row element
const onRowFn = (row) => {
    return {
        className: 'qbRow'
    };
};

class StandardGrid extends Component {
    constructor(props) {
        super(props);
        this.transforms = this.props.columnTransformsClasses.map((transformClass, index) => new transformClass(this, this.props.columnTransformProps[index]));
    }

    getColumns() {
        return _.reduce(this.transforms, (columns, transform) => transform.apply(columns), this.props.columns);
    }

    getUniqueRowKey({rowData}) {
        return `${this.props.id}-row-${rowData[this.props.rowKey]}`;
    }

    render() {
        return (
            <div className="gridWrapper">
                <StandardGridToolbar id={this.props.id}
                                     doUpdate={this.props.doUpdate}
                                     shouldFacet={this.props.shouldFacet}
                                     shouldSearch={this.props.shouldSearch}
                                     facetFields={this.props.facetFields}
                                     itemTypePlural={this.props.itemTypePlural}
                                     itemTypeSingular={this.props.itemTypeSingular}/>
                <div className="gridContainer">
                    <Table.Provider
                        className="qbGrid"
                        columns={this.getColumns()}
                        components={tableSubComponents}
                        >

                        <Table.Header className="qbHeader" />

                        <Table.Body
                            className="qbTbody"
                            rows={this.props.items}
                            rowKey={this.getUniqueRowKey.bind(this)}
                            onRow={onRowFn}
                            />
                    </Table.Provider>
                </div>
            </div>
        );
    }
}

StandardGrid.defaultProps = {
    shouldFacet: true,
    facetFields:[],
    shouldSearch: true
};

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
     * Whether to provide a search box
     */
    shouldSearch: PropTypes.bool,

    /**
     * Whether to Facet in this grid or no
     */
    shouldFacet: PropTypes.bool,

    /**
     * The Facet Fields to display
     */
    facetFields: PropTypes.array
};

StandardGrid.defaultProps = {
    items: [],
    columnTransformsClasses: [HeaderMenuColumnTransform],
    columnTransformProps: [
        {
            menuItemsClasses: [SortMenuItems]
        }
    ]
};

export {StandardGrid};

const mapStateToProps = (state, props) => {
    var gridState = state.Grids[props.id] || {};
    return {
        sortFids: gridState.sortFids || [],
        items : gridState.items
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    setSort(sortFid, asc, remove) {
        dispatch(StandardGridActions.setSort(props.id, sortFid, asc, remove));
        dispatch(StandardGridActions.doUpdate(props.id, props.doUpdate));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StandardGrid);
