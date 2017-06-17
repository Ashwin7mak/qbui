import React, {PropTypes, Component} from "react";
import QbIcon from "../../qbIcon/qbIcon";
import QbToolTip from "../../qbToolTip/qbToolTip";
import Device from "../../../utils/device";
import Breakpoints from "../../../utils/breakpoints";
import {connect} from "react-redux";
import {ENTER_KEY, SPACE_KEY} from "../../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants";
import _ from "lodash";
import {selectFieldOnForm, removeFieldFromForm, deselectField} from "../../../actions/formActions";
import FieldUtils from '../../../utils/fieldUtils';
import {getTable} from '../../../reducers/app';
import {CONTEXT} from "../../../actions/context";
import * as tabIndexConstants from '../tabindexConstants';
import "./fieldEditingTools.scss";

/**
 * Adds chrome around a field so that the field can be moved and edited.
 */
export class FieldEditingTools extends Component {
    onClickDelete = (e) => {
        if (this.props.removeFieldFromForm) {
            let appId = this.props.app ? this.props.app.id : null;
            return this.props.removeFieldFromForm(this.props.formId, appId, this.props.tblId, this.props.relatedField, this.props.location);
        }
        e.preventDefault();
    };

    onClickField = (e) => {
        let selectedField = this.props.selectedField ? this.props.selectedField[0] : undefined;

        if (this.props.selectFieldOnForm &&
            !(_.isEqual(this.props.location, selectedField))) {
            this.props.selectFieldOnForm(this.props.formId, this.props.location);
        } else if (this.props.deselectField) {
            this.props.deselectField(this.props.formId, this.props.location);
        }
        if (e) {
            e.preventDefault();
        }
    };

    isFieldSelected = () => {
        if (this.props.selectedFields) {
            return this.props.selectedFields.find(selectedField => _.isEqual(selectedField, this.props.location));
        }
    };

    renderActionIcons = () => {
        let tabIndex = '-1';

        if (this.props.isDragging) {
            return null;
        }

        if (this.isFieldSelected() && this.props.formBuilderChildrenTabIndex === tabIndexConstants.FORM_TAB_INDEX) {
            tabIndex = tabIndexConstants.FORM_TAB_INDEX;
        }

        let toolTipTextKey = "builder.formBuilder.removeField";
        let enableDelete = true;
        let deleteIconClasses = [];

        if (FieldUtils.isRecordTitleField(this.props.table, this.props.fieldId)) {
            toolTipTextKey = "builder.formBuilder.removeTitleField";
            enableDelete = false;
            deleteIconClasses.push('disabled');
        } else if (this.props.app && FieldUtils.isDetailKeyField(this.props.app.relationships, this.props.app.id, this.props.tblId, this.props.fieldId)) {
            toolTipTextKey = "builder.formBuilder.removeRelationshipField";
        }

        //Hide deleteFieldIcon if it is the last field on the form
        return (
            <div>
                {this.props.numberOfFieldsOnForm > 1 &&
                    <div className="actionIcons">
                        <div className="deleteFieldIcon">
                            <QbToolTip i18nMessageKey={toolTipTextKey}>
                                <button type="button" tabIndex={tabIndex} onClick={this.onClickDelete} disabled={enableDelete}>
                                    <QbIcon className={deleteIconClasses.join(' ')} icon="clear-mini"/>
                                </button>
                            </QbToolTip>
                        </div>
                    </div>
                }
            </div>
        );
    };

    componentDidMount() {
        /**
         * For keyboard, we need to reset the focus, to maintain proper tabbing order
         * and we need to keep the current form element in view, by scrolling it into view
         * */
        if (this.props.previouslySelectedField &&
            this.props.previouslySelectedField[0] &&
            this.props.formBuilderChildrenTabIndex !== "-1") {
            let previouslySelectedField = document.querySelectorAll(".fieldEditingTools");
            previouslySelectedField[this.props.previouslySelectedField[0].elementIndex].focus();
        } else if (this.props.selectedFields &&
            this.props.selectedFields[0] &&
            this.props.formBuilderChildrenTabIndex !== "-1" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA" &&
            document.activeElement.tagName !== "BUTTON") {
            let setFocusOnSelectedField = document.querySelectorAll(".fieldEditingTools")[this.props.selectedFields[0].elementIndex];
            if (setFocusOnSelectedField) {
                setFocusOnSelectedField.focus();
            }
        }
        this.updateScrollLocation();
    }

    getSelectedFormElementContainer() {
        let selectedFormElement = document.querySelector(".selectedFormElement");
        if (selectedFormElement) {
            return selectedFormElement.getBoundingClientRect();
        }
    }

    scrollElementUpIntoView = () => {
        /**
         * We only need to scroll into view for keyboard navigating
         * */
        let selectedFormElement = document.querySelector(".selectedFormElement");
        let isDragging = document.querySelector(".dragging");
        if (selectedFormElement && !isDragging) {
            this.props.formBuilderContainerContentElement.scrollTop = this.props.formBuilderContainerContentElement.scrollTop - 400;
        }
    };

    scrollElementDownIntoView = () => {
        /**
         * We only need to scroll into view for keyboard navigating
         * */
        let selectedFormElement = document.querySelector(".selectedFormElement");
        let isDragging = document.querySelector(".dragging");
        if (selectedFormElement && !isDragging) {
            this.props.formBuilderContainerContentElement.scrollTop = this.props.formBuilderContainerContentElement.scrollTop + 400;
        }
    };

    updateScrollLocation = () => {
        if (this.props.selectedFields && this.props.selectedFields[0]) {
            let selectedFormElement = this.getSelectedFormElementContainer();
            let selectedElementTop;
            let selectedElementBottom;

            if (selectedFormElement) {
                selectedElementTop = selectedFormElement.top;
                selectedElementBottom = selectedFormElement.bottom;
            }

            if (selectedElementBottom > window.innerHeight - 40) {
                this.scrollElementDownIntoView();
            } else if (selectedElementTop < 150) {
                this.scrollElementUpIntoView();
            }
        }
    };

    selectedCurrentField = (e) => {
        let isCurrentlySelectedField = true;

        if (this.props.selectedFields && this.props.selectedFields[0]) {
            isCurrentlySelectedField = !(_.isEqual(this.props.location, this.props.selectedFields[0]));
        }

        if ((e.which === ENTER_KEY || e.which === SPACE_KEY) && isCurrentlySelectedField) {
            this.onClickField(e);
        }
    };

    render() {
        let tabIndex = this.props.formBuilderChildrenTabIndex ? this.props.formBuilderChildrenTabIndex : "-1";
        let selectedField = this.props.selectedFields ? this.props.selectedFields[0] : {};
        let isSmall = Breakpoints.isSmallBreakpoint();
        let classNames = ["fieldEditingTools"];
        let isTouch = Device.isTouch();

        if (isTouch && !isSmall) {
            classNames.push("isTablet");
        } else if (!isTouch) {
            classNames.push("notTouchDevice");
        }

        if (this.props.isDragging && _.isEqual(this.props.location, selectedField)) {
            classNames.push("active");
        }

        if (this.isFieldSelected()) {
            classNames.push("selectedFormElement");
        }

        return (
            <div
                tabIndex={tabIndex}
                role="button"
                className={classNames.join(' ')}
                onClick={this.onClickField}
                onKeyDown={this.selectedCurrentField} >

                {this.renderActionIcons()}
            </div>
        );
    }
}

FieldEditingTools.propTypes = {
    formBuilderContainerContentElement: PropTypes.object,
    location: PropTypes.object,
    onClickDelete: PropTypes.func,
    isDragging: PropTypes.bool,
    app: PropTypes.object,
    tblId: PropTypes.string,
    fieldId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    formId: PropTypes.string
};

FieldEditingTools.defaultProps = {
    formId: CONTEXT.FORM.VIEW,
    isDeletable: true
};


const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || CONTEXT.FORM.VIEW);
    let currentForm = _.get(state, `forms[${formId}]`, {});
    let formBuilderChildrenTabIndex = _.get(currentForm, 'formBuilderChildrenTabIndex[0]', '-1');
    let selectedFields = (_.has(currentForm, "selectedFields") ? currentForm.selectedFields : []);
    let numberOfFieldsOnForm = (_.has(currentForm, "formData.formMeta.numberOfFieldsOnForm") ? currentForm.formData.formMeta.numberOfFieldsOnForm : 1);
    let previouslySelectedField = (_.has(currentForm, "previouslySelectedField") ? currentForm.previouslySelectedField : []);
    //If a new field is added to form builder we use the state isDragging to indicate whether or not it is in a dragging state,
    //If isDragging is undefined, then we use the components ownProps to indicate whether or not the field is in a dragging state
    let isDragging = ownProps.isDragging;
    if (!isDragging && _.has(currentForm, 'isDragging')) {
        isDragging = currentForm.isDragging;
    }
    let appId = ownProps.app ? ownProps.app.id : null;
    let table = getTable(state.app, appId, ownProps.tblId);
    return {
        selectedFields,
        previouslySelectedField,
        formBuilderChildrenTabIndex,
        isDragging,
        numberOfFieldsOnForm,
        table
    };
};

const mapDispatchToProps = {
    selectFieldOnForm,
    removeFieldFromForm,
    deselectField
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldEditingTools);
