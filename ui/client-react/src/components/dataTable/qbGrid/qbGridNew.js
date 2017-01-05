import React, {PropTypes} from 'react';
import * as Table from 'reactabular-table';
import Row from './row';
import FieldValueRenderer from '../../fields/fieldValueRenderer';
import FieldUtils from '../../../utils/fieldUtils';
import FieldFormats from '../../../utils/fieldFormats';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";


import './qbGrid.scss';

const QbGrid = React.createClass({
    propTypes: {
        columns: PropTypes.array.isRequired,
        rows: PropTypes.array.isRequired,
        // columns: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
        //     if (!(propValue instanceof Row)) {
        //         return new Error(
        //             'Invalid prop `' + propFullName + '` supplied to' +
        //             ' `' + componentName + '`. Validation failed.'
        //         );
        //     }
        // }).isRequired
    },

    getColumnDataCell(cellProps) {
        let colDef = _.cloneDeep(cellProps.children);

        if (_.has(colDef, 'fieldDef.datatypeAttributes.type')) {
            colDef.fieldDef.datatypeAttributes.type = FieldFormats.getFormatType(colDef.fieldDef.datatypeAttributes);
        }

        let classes = ['cellWrapper', FieldUtils.getFieldSpecificCellClass(colDef.fieldDef)];

        return (
            <td className={classes.join(' ')}>
                {/*let isEditable = FieldUtils.isFieldEditable(this.props.colDef.fieldDef);*/}
                {/*Use cellValueRenderer*/}
                {/*Some things missing from the the cell renderer version of FieldValueEditor*/}
                {/*isEditable={this.props.isEditable}*/}
                {/*key={"fvr-" + this.props.idKey}*/}
                {/*idKey={"fvr-" + this.props.idKey}*/}

                <FieldValueRenderer
                    type={colDef.fieldDef.datatypeAttributes.type}
                    classes={colDef.cellClass}
                    attributes={colDef.fieldDef.datatypeAttributes}




                    // Don't show duration units in the grid
                    includeUnits={false}
                    // Don't show unchecked checkboxes in the grid
                    hideUncheckedCheckbox={true}

                    {...colDef}
                />
            </td>
        );
    },

    getColumns() {
        return this.props.columns.map(column => {
            return column.gridHeader();
        });
    },

    getRows() {
        // return this.props.rows.map(row => {
        //     return row.toObject();
        // });
        // return [
        //     {
        //         id: 1,
        //         name: 'John',
        //         email: 'jon@test.com'
        //     },
        //     {
        //         id: 2,
        //         name: 'Bob',
        //         email: 'bob@test.com'
        //     },
        //     {
        //         id: 3,
        //         name: 'Sue',
        //         email: 'sue@test.com'
        //     }
        // ];
    },

    // getCellWrapper(cellProps) {
    //     let className = 'table-cell';
    //     return <td className={className}>some text</td>;
    // },
    //
    // getRowWrapper(rowProps) {
    //     let className = 'row';
    //     return <tr className={className}>{rowProps.children}</tr>;
    // },

    getRow(rowProps) {
        return <tr className="table-cell" {...rowProps} />;
    },

    getColumnHeaders() {
        return this.props.columns.map(column => {
            return <th>Hello</th>;
        });
    },

    render() {
        return (
            <Loader loaded={!this.props.loading} options={SpinnerConfigurations.LARGE_BREAKPOINT_REPORT}>
                <Table.Provider
                    ref="qbGridTable"
                    className="qbGrid"
                    columns={this.getColumns()}
                    components={{
                        body: {
                            row: this.getRow,
                            cell: this.getColumnDataCell,
                            header: this.getHeader,
                        }
                    }}
                >
                    <Table.Header />

                    <Table.Body rows={this.props.rows} rowKey="id" />
                </Table.Provider>
            </Loader>
        );

    }
});

export default QbGrid;
