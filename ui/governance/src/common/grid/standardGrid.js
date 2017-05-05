import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import '../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss';
import './standardGrid.scss';
import * as Table from 'reactabular-table';
import {connect} from 'react-redux';

import QbHeaderCell from '../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../../client-react/src/components/dataTable/qbGrid/qbRow';
import QbCell from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';

import HeaderMenuColumnTransform from './transforms/headerMenuColumnTransform';
import SortMenuItems from './headerMenu/sort/sortMenuItems';
import * as StandardGridActions from './standardGridActions';
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
                                     doUpdate={this.props.doUpdate}/>
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

StandardGrid.propTypes = {
    columns: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    rowKey: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    columnTransforms: PropTypes.array,
    columnTransformProps: PropTypes.array,
    doUpdate: PropTypes.func.isRequired
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
