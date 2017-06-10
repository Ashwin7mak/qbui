import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import FieldToken from './fieldToken';
import FieldFormats from '../../../utils/fieldFormats';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';
import {addFieldToForm, endDraggingState, isInDraggingState} from "../../../actions/formActions";
import {hideRelationshipDialog} from "../../../actions/relationshipBuilderActions";
import {getFormByContext, getSelectedFormElement} from '../../../reducers/forms';
import {updateFormAnimationState} from '../../../actions/animationActions';
import {CONTEXT} from '../../../actions/context';
import {ENTER_KEY, SPACE_KEY} from '../../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';
import _ from 'lodash';
import DraggableField from '../draggableField';
import fieldFormats from '../../../utils/fieldFormats';
import Locale from '../../../../../reuse/client/src/locales/locale';

/**
 * A FieldToken that is extended to be displayed in a menu (i.e., Tool Palette) when building a form.
 */
export class FieldTokenInMenu extends Component {
    render() {
        const fieldToken = <FieldToken isDragging={false} {...this.props} />;

        if (this.props.tooltipText) {
            return (
                <div >
                    <Tooltip location="right" plainMessage={this.props.tooltipText}>
                        {fieldToken}
                    </Tooltip>
                </div>
            );
        }

        return fieldToken;
    }
}

const Element = DraggableField(FieldTokenInMenu, false);

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
         * This state is very particular to this component (i.e., does not need to be in a Redux store)
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
        this.props.addFieldToForm(formId, appId, tblId, selectedField, relatedField);
    };

    onEnterClickToAdd = (e) => {
        if (e.which === ENTER_KEY || e.which === SPACE_KEY) {
            this.clickToAddToForm();
            e.preventDefault();
        }
    };


    /**
     * This is called when the field token is dragged over a droppable target on the form
     * It adds the field if it has not been added yet.
     * @param dropTargetProps
     * @param _dragItemProps
     */
    onHover = (dropTargetProps, _dragItemProps) => {
        if (!this.state.addedToForm) {
            const {formId, appId, tblId, relatedField} = this.props;

            this.props.addFieldToForm(formId, appId, tblId, dropTargetProps.location, relatedField);
            this.setState({addedToForm: true});
        }
    };

    /**
     * It resets the state when dragging is complete so the new field can be added again
     */
    endDrag = () => {
        this.setState({addedToForm: false});
        this.props.updateFormAnimationState(false);
        if (this.props.endDrag) {
            this.props.endDrag();
        }
    };

    render = () => {
        return (
            <div className="fieldTokenInMenuWrapper"
                 onClick={this.clickToAddToForm}
                 tabIndex={this.props.tabIndex}
                 onKeyDown={this.onEnterClickToAdd}>
                <Element {...this.props}
                         onHover={this.onHover}
                         endDrag={this.endDrag}
                         endDraggingState={this.props.endDraggingState}
                         isInDraggingState={this.props.isInDraggingState}/>
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
    isCollapsed: PropTypes.bool,

    /**
     * Tabindex */
    toolPaletteChildrenTabIndex: PropTypes.number
};

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);

    return {
        formId: _.get(currentForm, 'id'),
        appId: _.get(currentForm, 'formData.formMeta.appId'),
        tblId: _.get(currentForm, 'formData.formMeta.tableId'),
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : null),
        selectedFormElement: (currentForm ? getSelectedFormElement(state, currentForm.id) : undefined)
    };
};

const mapDispatchToProps = {
    addFieldToForm,
    hideRelationshipDialog,
    updateFormAnimationState,
    endDraggingState,
    isInDraggingState
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableFieldToken);
