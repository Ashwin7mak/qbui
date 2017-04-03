import React, {PropTypes} from 'react';
import ReactDom from 'react-dom';
import FieldValueEditor from '../../fields/fieldValueEditor';
import CellValueRenderer from '../qbGrid/cellValueRenderer';
import FieldUtils from '../../../utils/fieldUtils';
import FieldFormats from '../../../utils/fieldFormats';
import QbIcon from '../../qbIcon/qbIcon';
import QbToolTip from '../../qbToolTip/qbToolTip';

const ReportCell = React.createClass({
    propTypes: {
        appUsers: PropTypes.array,
        onCellClick: PropTypes.func,
        onCellChange: PropTypes.func,
        onCellBlur: PropTypes.func,
        onCellClickEditIcon: PropTypes.func,
        fieldDef: PropTypes.object,
        uniqueElementKey: PropTypes.string,
        recordId: PropTypes.number,
        cellClass: PropTypes.string,
        isEditing: PropTypes.bool,
        isInvalid: PropTypes.bool,
        invalidMessage: PropTypes.string,
        invalidResultData: PropTypes.object,
        validateFieldValue: PropTypes.func,

        // relationship phase-1, will need remove when we allow editing
        phase1: PropTypes.bool,

        /**
         * A property that tells this component to set focus on the first input in the FieldValue editor when it is in editing mode.
         * Note: The reportRowTransformer ensures this is only passed as true the first time the field is set to editing mode to avoid state in multiple places. */
        hasFocusOnEditStart: PropTypes.bool
    },
    // TODO:: Turn performance improvements back on. https://quickbase.atlassian.net/browse/MB-1976
    // shouldComponentUpdate(nextProps) {
    //     return (this.props.value !== nextProps.value || this.props.display !== nextProps.display || this.props.isEditing !== nextProps.isEditing);
    // },

    componentDidUpdate() {
        if (this.props.hasFocusOnEditStart && this.props.isEditing) {
            this.focusFieldValueEditorFirstInput();
        }
    },

    onCellClick() {
        if (this.props.onCellClick) {
            this.props.onCellClick(this.props.recordId);
        }
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

    onCellClickEditIcon(event) {
        event.stopPropagation();
        if (this.props.onCellClickEditIcon) {
            this.props.onCellClickEditIcon(this.props.recordId, this.props.fieldDef);
        }
    },

    shouldRenderEditIcon(isFieldEditable) {
        // We don't want to render an edit icon if another row is currently being edited. That is why we check for the editingRecordId to be null.
        const currentlyEditable = !this.props.isInlineEditOpen && isFieldEditable;
        return (!this.props.phase1 && currentlyEditable);
    },

    renderEditIcon(isFieldEditable) {
        if (this.shouldRenderEditIcon(isFieldEditable)) {
            return (
                <div className="cellEditIcon" onClick={this.onCellClickEditIcon}>
                    <QbToolTip i18nMessageKey="report.inlineEdit">
                        <QbIcon icon="edit"/>
                    </QbToolTip>
                </div>
            );
        }
    },

    /**
     * Using a function to set a ref is the recommended approach for refs going forward.
     * https://facebook.github.io/react/docs/refs-and-the-dom.html
     * @param component
     */
    setFieldValueEditorComponentRef(component) {
        this.fieldValueEditorComponentRef = component;
    },

    /**
     * Some field types do not have an <input> so we need to find the correct place for focusing an edit for some fields.
     * @param renderedComponent
     * @returns {Element}
     */
    findFocusableInput(renderedComponent) {
        let input = renderedComponent.querySelector('input');

        // The input for checkbox is hidden and off to the side so focus on the actionable div for the checkbox instead
        if (input && input.type === 'checkbox') {
            return renderedComponent.querySelector('.checkbox.editor');
        } else if (!input) {
            // If there is not an <input> element, try <textarea> (for multiline text)
            return renderedComponent.querySelector('textarea');
        } else {
            return input;
        }
    },

    /**
     * A ref is used to find the FieldValueEditor and the query for the first input. The logic for is here because this
     * behavior is specific to a reportCell and not other instances of FieldValueEditor.
     */
    focusFieldValueEditorFirstInput() {
        if (this.fieldValueEditorComponentRef) {
            let renderedComponent = ReactDom.findDOMNode(this.fieldValueEditorComponentRef);

            let input = this.findFocusableInput(renderedComponent);
            if (input) {
                input.focus();
            }
        }
    },

    render() {
        let fieldDef = this.props.fieldDef;

        // If the column doesn't have a field definition, a field value cell cannot be created. Return a blank cell
        // that can be altered by column specific formatters/transformers.
        if (!fieldDef) {
            return <td {...this.props} />;
        }

        // The field types are different on the server and the UI. Need to make sure we translate them before passing to certain functions.
        // Both versions (server and UI constants) for field types are currently required throughout the chain of creating/validating a field
        // with the FieldValueRenderer
        let uiFieldType = FieldFormats.getFormatType(fieldDef);


        let classes = ['cellWrapper', FieldUtils.getFieldSpecificCellClass(uiFieldType, fieldDef), ...FieldUtils.getCellAlignmentClassesForFieldType(fieldDef)];

        // We set this here so that cells that are not editable (e.g., Record Id) can still get some visual treatment
        // when the row is in editing mode
        if (this.props.isEditing) {
            classes.push('editingCell');
        }

        let isFieldEditable = FieldUtils.isFieldEditable(fieldDef);

        if (this.props.isEditing && isFieldEditable) {
            return (
                <div className={classes.join(' ')}>
                    <FieldValueEditor
                        ref={this.setFieldValueEditorComponentRef}
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
                        showScrollForMultiLine={true}
                    />
                </div>
            );
        }

        return (
            <div className={classes.join(' ')}>
                <div className="cellClickableArea" onClick={this.onCellClick}>
                    <CellValueRenderer
                        {...this.props}
                        type={uiFieldType}
                        classes={this.props.cellClass}
                        attributes={fieldDef.datatypeAttributes}
                        isEditable={isFieldEditable}
                        idKey={`fvr-${this.props.uniqueElementKey}`}
                        key={`fvr-${this.props.uniqueElementKey}`}

                        // Don't show duration units in the grid
                        includeUnits={false}

                        // Don't show unchecked checkboxes in the grid
                        hideUncheckedCheckbox={true}
                    />
                </div>
                {this.renderEditIcon(isFieldEditable)}
            </div>
        );
    }
});

export default ReportCell;
