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
import {selectFieldOnForm, removeFieldFromForm} from "../../../actions/formActions";

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
        this.scrollElementIntoView = this.scrollElementIntoView.bind(this);
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
        if (this.props.selectFieldOnForm) {
            this.props.selectFieldOnForm(this.props.formId, this.props.location);
            if (e) {
                e.preventDefault();
            }
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

        if (this.isFieldSelected()) {
            tabIndex = '0';
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
        if (this.props.previouslySelectedField && this.props.previouslySelectedField[0] && this.props.tabIndex !== "-1") {
            let previouslySelectedField = document.querySelectorAll(".fieldEditingTools");
            previouslySelectedField[this.props.previouslySelectedField[0].elementIndex].focus();
        } else if (this.props.selectedFields && this.props.selectedFields[0]) {
            let setFocusOnSelectedField = document.querySelectorAll(".fieldEditingTools");
            setFocusOnSelectedField[this.props.selectedFields[0].elementIndex].focus();
        }
        this.updateScrollLocation();
    }

    getSelectedFormElementContainer() {
        let selectedFormElement = document.querySelector(".selectedFormElement");
        if (selectedFormElement) {
            return selectedFormElement.getBoundingClientRect();
        }
    }

    scrollElementIntoView() {
        let selectedFormElement = document.querySelector(".selectedFormElement");
        if (selectedFormElement) {
            document.querySelector(".selectedFormElement").scrollIntoView(false);
        }
    }

    updateScrollLocation() {
        if (this.props.selectedFields && this.props.selectedFields[0]) {
            let selectedFormElement = this.getSelectedFormElementContainer();
            let absoluteElementTop = selectedFormElement.top + window.pageYOffset;
            let bottom = absoluteElementTop + selectedFormElement.height;

            if (bottom > window.innerHeight - 40 || absoluteElementTop < 50) {
                this.scrollElementIntoView();
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
        let tabIndex = this.props.selectedFields && this.props.selectedFields[0] ? "0" : this.props.tabIndex;

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
    location: PropTypes.object,
    onClickDelete: PropTypes.func,
    onClickFieldPreferences: PropTypes.func,
    isDragging: PropTypes.bool,
    formId: PropTypes.string
};

FieldEditingTools.defaultProps = {
    formId: "view",
};


const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || "view");
    let currentForm = state.forms.find(form => form.id === formId);
    let tabIndex = currentForm.formBuilderChildrenTabIndex ? currentForm.formBuilderChildrenTabIndex[0] : '-1';
    let selectedFields = (_.has(currentForm, "selectedFields") ? currentForm.selectedFields : []);
    let previouslySelectedField = (_.has(currentForm, "previouslySelectedField") ? currentForm.previouslySelectedField : []);

    return {
        selectedFields,
        previouslySelectedField,
        tabIndex
    };
};

const mapDispatchToProps = {
    selectFieldOnForm,
    removeFieldFromForm
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldEditingTools);
