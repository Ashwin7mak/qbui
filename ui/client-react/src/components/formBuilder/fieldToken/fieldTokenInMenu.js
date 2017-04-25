import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import FieldToken from './fieldToken';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';
import {addNewFieldToForm} from "../../../actions/formActions";
import {getFormByContext, getSelectedFormElement} from '../../../reducers/forms';
import {CONTEXT} from '../../../actions/context';
import _ from 'lodash';
import DraggableField from '../draggableField';

/**
 * A FieldToken that is extended to be displayed in a menu (i.e., Tool Palette) when building a form.
 */
export class FieldTokenInMenu extends Component {
    render() {
        const fieldToken = <FieldToken isDragging={false} {...this.props} />;

        if (this.props.tooltipText) {
            return (
                <Tooltip location="right" plainMessage={this.props.tooltipText}>
                    {fieldToken}
                </Tooltip>
            );
        }

        return fieldToken;
    }
}

/**
 * A component which allows the field token to be clicked and dragged. The click and drag cannot be on the same element because drag
 * will take precedence over click, making the element un-clickable.
 *
 * In addition, it allows some extra methods to be passed through to the DraggableField component which is
 * not possible if this component only had one layer.
 */
export class DraggableFieldToken extends Component {
    constructor(props) {
        super(props);

        /**
         * This state is very particular to this component (e.g., does not need to be in a Redux store)
         * It tracks whether or not the component has been added when dragging onto a form.
         * addedToForm gets set to true the first time the component is dragged onto the form.
         * addedToForm gets set to false when dragging has been completed (user dropped the item)
         * @type {{addedToForm: boolean}}
         */
        this.state = {
            addedToForm: false
        };
    }

    clickToAddToForm = () => {
        const {selectedField, formId, appId, tblId, relatedField} = this.props;
        this.props.addNewFieldToForm(formId, appId, tblId, selectedField, relatedField);
    };

    /**
     * This is called when a the field token is dragged over a droppable target on the form
     * It adds the field if it has not been added yet.
     * @param dropTargetProps
     * @param _dragItemProps
     */
    onHover = (dropTargetProps, _dragItemProps) => {
        if (!this.state.addedToForm) {
            const {formId, appId, tblId, relatedField} = this.props;

            // For a better user experience, we place the new element above the item is was dropped on, rather than below it.
            const location = dropTargetProps.location;
            const elementIndex = (_.has(location, 'elementIndex') && location.elementIndex > 1 ? location.elementIndex - 1 : 0);

            this.props.addNewFieldToForm(formId, appId, tblId, {...location, elementIndex}, relatedField);
            this.setState({addedToForm: true});
        }
    };

    /**
     * It resets the state when dragging is complete so the new field can be added again
     */
    endDrag = () => this.setState({addedToForm: false});

    render() {
        const Element = DraggableField(FieldTokenInMenu, false);

        return (
            <div onClick={this.clickToAddToForm}>
                <Element {...this.props} onHover={this.onHover} endDrag={this.endDrag} />
            </div>
        );
    }
}

FieldTokenInMenu.propTypes = {
    /**
     * What field type does this token represent? */
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * What title should be used on the field token? */
    title: PropTypes.string.isRequired,

    /**
     * Text to display in a tooltip. It should be localized. */
    tooltipText: PropTypes.string,

    /**
     * Can optionally show the token in a collapsed state (icon only) */
    isCollapsed: PropTypes.bool
};

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);
    let selectedField = (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : null);

    return {
        formId: _.get(currentForm, 'id'),
        appId: _.get(currentForm, 'formData.formMeta.appId'),
        tblId: _.get(currentForm, 'formData.formMeta.tableId'),
        selectedField: selectedField,
        selectedFormElement: (currentForm ? getSelectedFormElement(state, currentForm.id) : undefined)
    };
};

const mapDispatchToProps = {
    addNewFieldToForm
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableFieldToken);
