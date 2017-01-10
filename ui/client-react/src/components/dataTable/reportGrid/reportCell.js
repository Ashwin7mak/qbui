import React, {PropTypes} from 'react';
import FieldValueEditor from '../../fields/fieldValueEditor';
import CellValueRenderer from '../agGrid/cellValueRenderer';
import FieldUtils from '../../../utils/fieldUtils';
import FieldFormats from '../../../utils/fieldFormats';
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
        isEditing: PropTypes.bool
    },

    shouldComponentUpdate(nextProps) {
        // let nextValue = nextProps.children.value;
        // let nextDisplay = nextProps.children.display;
        // let currentValue = this.props.children.value;
        // let currentDisplay = this.props.children.display;
        // TODO:: Can't use this optimization right now because of the checkboxes in the first column. Revisit later.
        // return (currentValue !== nextValue || currentDisplay !== nextDisplay || this.props.children.isEditing !== nextProps.children.isEditing);
        return true;
    },

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
                console.log('start editing record ' + recordId);

                this.props.onCellClick(recordId);
            } else {
                console.log('could not find on cell click function');
            }
        };
    },

    render() {
        let fieldDef = this.props.fieldDef;

        // If the column doesn't have a field definition, a field value cell cannot be created. Return a blank cell
        // that can be altered by column specific formatters/transformers.
        if (!fieldDef) {
            return <td {...this.props} />;
        }

        if (_.has(fieldDef, 'datatypeAttributes.type')) {
            fieldDef.datatypeAttributes.type = FieldFormats.getFormatType(fieldDef.datatypeAttributes);
        }

        let classes = ['cellWrapper', FieldUtils.getFieldSpecificCellClass(fieldDef)];
        let isEditable = FieldUtils.isFieldEditable(fieldDef);

        if (this.props.isEditing && isEditable) {
            return (
                <div className={classes.join(' ')}>
                    <FieldValueEditor
                        {...this.props}
                        type={fieldDef.datatypeAttributes.type}
                        fieldDef={fieldDef}
                        fieldName={fieldDef.name}
                        idKey={`fve-${this.props.uniqueElementKey}`}
                        appUsers={this.props.appUsers}
                        onChange={this.onCellChange(this.props)}
                        onBlur={this.onCellBlur(this.props)}
                    />
                </div>
            );
        }

        return (
            <div className={classes.join(' ')}  onClick={this.onCellClick(this.props.recordId)}>

                <CellValueRenderer
                    {...this.props}
                    type={fieldDef.datatypeAttributes.type}
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
            </div>
        );
    }
});

export default ReportCell;
