import React, {PropTypes, Component} from "react";
import AVAILABLE_ICON_FONTS from "../../../constants/iconConstants";
import QbIcon from "../../qbIcon/qbIcon";
import QbToolTip from "../../qbToolTip/qbToolTip";
import DragHandle from "../dragHandle/dragHandle";
import Device from "../../../utils/device";
import Breakpoints from "../../../utils/breakpoints";
import {connect} from "react-redux";
import {ENTER_KEY, SPACE_KEY} from "../../../../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants";
import _ from "lodash";
import {selectFieldOnForm, removeFieldFromForm, deselectField} from "../../../actions/formActions";
import {CONTEXT} from "../../../actions/context";
import * as tabIndexConstants from '../tabindexConstants';
import "./fieldEditingTools.scss";

/**
 * Adds chrome around a field so that the field can be moved and edited.
 */
export class FieldEditingTools extends Component {
    constructor(props) {
        super(props);

        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickFieldPreferences = this.onClickFieldPreferences.bind(this);
        this.onClickField = this.onClickField.bind(this);
        this.isFieldSelected = this.isFieldSelected.bind(this);
        this.renderActionIcons = this.renderActionIcons.bind(this);

        this.selectedCurrentField = this.selectedCurrentField.bind(this);
        this.getSelectedFormElementContainer = this.getSelectedFormElementContainer.bind(this);
        this.updateScrollLocation = this.updateScrollLocation.bind(this);
    }

    onClickDelete(e) {
        if (this.props.removeFieldFromForm) {
            return this.props.removeFieldFromForm(this.props.formId, this.props.location);
        }
        e.preventDefault();
    }

    onClickFieldPreferences() {
        if (this.props.onClickFieldPreferences) {
            return this.props.onClickFieldPreferences(this.props.location);
        }
    }

    onClickField(e) {
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
    }

    isFieldSelected() {
        if (this.props.selectedFields) {
            return this.props.selectedFields.find(selectedField => _.isEqual(selectedField, this.props.location));
        }
    }

    renderActionIcons() {
        let tabIndex = '-1';

        if (this.props.isDragging) {
            return null;
        }

        if (this.isFieldSelected() && this.props.formBuilderChildrenTabIndex === tabIndexConstants.FORM_TAB_INDEX) {
            tabIndex = tabIndexConstants.FORM_TAB_INDEX;
        } else {
            tabIndex = '-1';
        }

        return (
            <div className="actionIcons">
                    <div className="deleteFieldIcon">
                        <QbToolTip i18nMessageKey="builder.formBuilder.removeField">
                           <button tabIndex={tabIndex} onClick={this.onClickDelete}> <QbIcon icon="delete" /> </button>
                        </QbToolTip>
                    </div>

                    <div  className="fieldPreferencesIcon">
                        <QbToolTip i18nMessageKey="builder.formBuilder.unimplemented">
                            <button tabIndex={tabIndex} onClick={this.onClickFieldPreferences}> <QbIcon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon="Dimensions"/> </button>
                        </QbToolTip>
                    </div>
            </div>
        );
    }

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
            document.activeElement.tagName !== "TEXTAREA") {
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
    }

    scrollElementDownIntoView = () => {
        /**
         * We only need to scroll into view for keyboard navigating
         * */
        let selectedFormElement = document.querySelector(".selectedFormElement");
        let isDragging = document.querySelector(".dragging");
        if (selectedFormElement && !isDragging) {
            this.props.formBuilderContainerContentElement.scrollTop = this.props.formBuilderContainerContentElement.scrollTop + 400;
        }
    }

    updateScrollLocation() {
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
    }

    selectedCurrentField(e) {
        let isCurrentlySelectedField = true;

        if (this.props.selectedFields && this.props.selectedFields[0]) {
            isCurrentlySelectedField = !(_.isEqual(this.props.location, this.props.selectedFields[0]));
        }

        if ((e.which === ENTER_KEY || e.which === SPACE_KEY) && isCurrentlySelectedField) {
            this.onClickField(e);
        }
    }

    render() {
        let tabIndex = this.props.formBuilderChildrenTabIndex ? this.props.formBuilderChildrenTabIndex : "-1";

        let isSmall = Breakpoints.isSmallBreakpoint();
        let classNames = ["fieldEditingTools"];
        let isTouch = Device.isTouch();

        if (isTouch && !isSmall) {
            classNames.push("isTablet");
        } else if (!isTouch) {
            classNames.push("notTouchDevice");
        }

        if (this.props.isDragging) {
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
                onKeyDown={this.selectedCurrentField}
            >

                <DragHandle />

                {this.renderActionIcons()}
            </div>
        );
    }
}

FieldEditingTools.propTypes = {
    formBuilderContainerContentElement: PropTypes.object,
    location: PropTypes.object,
    onClickDelete: PropTypes.func,
    onClickFieldPreferences: PropTypes.func,
    isDragging: PropTypes.bool,
    formId: PropTypes.string
};

FieldEditingTools.defaultProps = {
    formId: CONTEXT.FORM.VIEW,
};


const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || CONTEXT.FORM.VIEW);
    let currentForm = _.get(state, `forms[${formId}]`, {});
    let formBuilderChildrenTabIndex = _.get(currentForm, 'formBuilderChildrenTabIndex[0]', '-1');
    let selectedFields = (_.has(currentForm, "selectedFields") ? currentForm.selectedFields : []);
    let previouslySelectedField = (_.has(currentForm, "previouslySelectedField") ? currentForm.previouslySelectedField : []);

    return {
        selectedFields,
        previouslySelectedField,
        formBuilderChildrenTabIndex
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
