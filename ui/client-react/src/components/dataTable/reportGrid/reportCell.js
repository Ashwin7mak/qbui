import React, {PropTypes} from 'react';
import FieldValueEditor from '../../fields/fieldValueEditor';
import CellValueRenderer from '../agGrid/cellValueRenderer';
import FieldUtils from '../../../utils/fieldUtils';
import FieldFormats from '../../../utils/fieldFormats';
import QbIcon from '../../qbIcon/qbIcon';
import _ from 'lodash';

const ReportCell = React.createClass({
    propTypes: {
        appUsers: PropTypes.array,
        onCellChange: PropTypes.func.isRequired,
        onCellBlur: PropTypes.func.isRequired,
        onCellClick: PropTypes.func.isRequired,
        fieldDef: PropTypes.object,
        uniqueElementKey: PropTypes.string,
        recordId: PropTypes.number,
        cellClass: PropTypes.string,
        isEditing: PropTypes.bool,
        isInvalid: PropTypes.bool,
        invalidMessage: PropTypes.string,
        invalidResultData: PropTypes.object,
        validateFieldValue: PropTypes.func,
    },
    //
    // shouldComponentUpdate(nextProps) {
    //     return (this.props.value !== nextProps.value || this.props.display !== nextProps.display || this.props.isEditing !== nextProps.isEditing);
    // },

    onCellChange(colDef) {
        return (newValue) => {
            if (this.props.onCellChange) {
                this.props.onCellChange(newValue, colDef);
            }
        };
    },

    onCellBlur(colDef) {
        return (newValue) => {
            if (this.props.onCellBlur) {
                this.props.onCellBlur(newValue, colDef);
            }
        };
    },

    onCellClick(recordId) {
        return () => {
            if (this.props.onCellClick) {
                this.props.onCellClick(recordId);
            }
        };
    },

    render() {
        let fieldDef = this.props.fieldDef;

        // The field types are different on the server and the UI. Need to make sure we translate them before passing to certain functions.
        // Both versions (server and UI constants) for field types are currently required throughout the chain of creating/validating a field
        // with the FieldValueRenderer
        let uiFieldType = FieldFormats.getFormatType(fieldDef.datatypeAttributes);

        // If the column doesn't have a field definition, a field value cell cannot be created. Return a blank cell
        // that can be altered by column specific formatters/transformers.
        if (!fieldDef) {
            return <td {...this.props} />;
        }

        let classes = ['cellWrapper', FieldUtils.getFieldSpecificCellClass(uiFieldType, fieldDef)];

        // We set this here so that cells that are not editable (e.g., Record Id) can still get some visual treatment
        // when the row is in editing mode
        if (this.props.isEditing) {
            classes.push('editingCell');
        }

        let isEditable = FieldUtils.isFieldEditable(fieldDef);

        if (this.props.isEditing && isEditable) {
            return (
                <div className={classes.join(' ')}>
                    <FieldValueEditor
                        {...this.props}
                        type={uiFieldType}
                        fieldDef={fieldDef}
                        fieldName={fieldDef.name}
                        idKey={`fve-${this.props.uniqueElementKey}`}
                        appUsers={this.props.appUsers}
                        onChange={this.onCellChange(this.props)}
                        onBlur={this.onCellBlur(this.props)}
                        isInvalid={this.props.isInvalid}
                        invalidMessage={this.props.invalidMessage}
                        invalidResultData={this.props.invalidResultsData}
                        validateFieldValue={this.props.validateFieldValue}
                        indicateRequired={true}
                    />
                </div>
            );
        }

        return (
            <div className={classes.join(' ')}>
                <CellValueRenderer
                    {...this.props}
                    type={uiFieldType}
                    classes={this.props.cellClass}
                    attributes={fieldDef.datatypeAttributes}
                    isEditable={isEditable}
                    idKey={`fvr-${this.props.uniqueElementKey}`}
                    key={`fvr-${this.props.uniqueElementKey}`}

                    // Don't show duration units in the grid
                    includeUnits={false}

                    // Don't show unchecked checkboxes in the grid
                    hideUncheckedCheckbox={true}
                />
                <QbIcon className="cellEditIcon" icon="edit" onClick={this.onCellClick(this.props.recordId)} />
            </div>
        );
    }
});

export default ReportCell;
