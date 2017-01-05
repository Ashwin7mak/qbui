import React from 'react';
import FieldValueEditor from '../../fields/fieldValueEditor';
import CellValueRenderer from '../agGrid/cellValueRenderer';
import FieldUtils from '../../../utils/fieldUtils';
import FieldFormats from '../../../utils/fieldFormats';
import _ from 'lodash';

const CellWrapper = React.createClass({
    shouldComponentUpdate(nextProps) {
        let nextValue = nextProps.children.value;
        let nextDisplay = nextProps.children.display;
        let currentValue = this.props.children.value;
        let currentDisplay = this.props.children.display;

        return (currentValue !== nextValue || currentDisplay !== nextDisplay || this.props.children.editing !== nextProps.children.editing);
    },

    render() {
        let colDef = _.cloneDeep(this.props.children);
        let fieldDef = colDef.fieldDef;

        if (_.has(colDef, 'fieldDef.datatypeAttributes.type')) {
            fieldDef.datatypeAttributes.type = FieldFormats.getFormatType(fieldDef.datatypeAttributes);
        }

        let classes = ['cellWrapper', FieldUtils.getFieldSpecificCellClass(fieldDef)];
        let isEditable = FieldUtils.isFieldEditable(fieldDef);

        if (colDef.editing && isEditable) {
            return (
                <td className={classes.join(' ')}>
                    <FieldValueEditor
                        {...colDef}
                        type={colDef.fieldDef.datatypeAttributes.type}
                        fieldDef={fieldDef}
                        fieldName={fieldDef.name}
                        idKey={`fve-${colDef.key}`}
                        appUsers={colDef.appUsers}
                        onChange={colDef.editCell(colDef)}
                        onBlur={colDef.onCellBlur(colDef)}
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
    }
});

export default CellWrapper;
