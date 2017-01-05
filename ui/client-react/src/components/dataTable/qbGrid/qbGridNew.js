import React, {PropTypes} from 'react';
import * as Table from 'reactabular-table';
import CellValueRenderer from '../agGrid/cellValueRenderer';
import FieldUtils from '../../../utils/fieldUtils';
import FieldFormats from '../../../utils/fieldFormats';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import RowWrapper from './rowWrapper';
import FieldValueEditor from '../../fields/fieldValueEditor';


import './qbGrid.scss';

const QbGrid = React.createClass({
    propTypes: {
        columns: PropTypes.array.isRequired,
        rows: PropTypes.array.isRequired,
        startEditingRow: PropTypes.func.isRequired,
        appUsers: PropTypes.array.isRequired,
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
        let fieldDef = colDef.fieldDef;

        if (_.has(colDef, 'fieldDef.datatypeAttributes.type')) {
            fieldDef.datatypeAttributes.type = FieldFormats.getFormatType(fieldDef.datatypeAttributes);
        }

        let classes = ['cellWrapper', FieldUtils.getFieldSpecificCellClass(fieldDef)];
        let isEditable = FieldUtils.isFieldEditable(fieldDef);

        if (colDef.editing) {
            return (
                <td className={classes.join(' ')}>
                    <FieldValueEditor
                        {...colDef}
                        type={colDef.fieldDef.datatypeAttributes.type}
                        fieldDef={fieldDef}
                        fieldName={fieldDef.name}
                        idKey={`fve-${colDef.key}`}
                        appUsers={this.props.appUsers}
                    />
                </td>
            );
        }

        return (
            <td className={classes.join(' ')}>

                <CellValueRenderer
                    type={colDef.fieldDef.datatypeAttributes.type}
                    classes={colDef.cellClass}
                    attributes={colDef.fieldDef.datatypeAttributes}
                    isEditable={isEditable}
                    idKey={`fvr-${colDef.key}`}
                    key={`fvr-${colDef.key}`}

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
    getRecordIdForRow(rowProps) {
        let keys = Object.keys(rowProps);
        if (keys.length === 0) {
            return null;
        }

        let firstField = rowProps[keys[0]];

        if (!_.isObject(firstField)) {
            return null;
        }

        return firstField.recordId;
    },

    startEditingRow(recordId) {
        return (ev) => {
            this.props.startEditingRow(recordId);
        };
    },

    addRowDecorators(row, {rowIndex, rowKey}) {
        let classes = ['table-row'];
        let recordId = this.getRecordIdForRow(row);
        if (row.editing) {
            classes.push('editing');
        }
        return {
            className: classes.join(' '),
            onClick: this.startEditingRow(recordId),
            editing: row.editing
        };
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
                            row: RowWrapper,
                            cell: this.getColumnDataCell,
                            header: this.getHeader,
                        }
                    }}
                >
                    <Table.Header />

                    <Table.Body onRow={this.addRowDecorators} rows={this.props.rows} rowKey="id" />
                </Table.Provider>
            </Loader>
        );

    }
});

export default QbGrid;
