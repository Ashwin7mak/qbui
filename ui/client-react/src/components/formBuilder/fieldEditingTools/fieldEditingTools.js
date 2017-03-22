import React, {PropTypes, Component} from 'react';
import AVAILABLE_ICON_FONTS from '../../../constants/iconConstants';
import QbIcon from '../../qbIcon/qbIcon';
import QbToolTip from '../../qbToolTip/qbToolTip';
import DragHandle from '../dragHandle/dragHandle';
import Device from '../../../utils/device';
import Breakpoints from '../../../utils/breakpoints';
import {connect} from 'react-redux';
import _ from 'lodash';
import {selectFieldOnForm, keyBoardMoveFieldUp, keyboardMoveFieldDown} from '../../../actions/formActions';

import ReKeyboardShortcuts from '../../../../../reuse/client/src/components/reKeyboardShortcuts/reKeyboardShortcuts';

import './fieldEditingTools.scss';

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
        this.keyboardMoveFieldUp = this.keyboardMoveFieldUp.bind(this);
        this.keyboardMoveFieldDown = this.keyboardMoveFieldDown.bind(this);
        this.scrollElementIntoView = this.scrollElementIntoView.bind(this);
        this.updateScrollLocation = this.updateScrollLocation.bind(this);
    }

    onClickDelete(e) {
        if (this.props.removeField) {
            return this.props.removeField(this.props.location);
        }
        e.preventDefault();
    }

    onClickFieldPreferences() {
        if (this.props.onClickFieldPreferences) {
            return this.props.onClickFieldPreferences(this.props.location);
        }
    }

    onClickField(e) {
        if (this.props.selectField) {
            this.props.selectField(this.props.formId, this.props.location);
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
        let tabIndex = "-1";

        if (this.props.isDragging) {
            return null;
        }

        if (this.isFieldSelected()) {
            tabIndex = "0";
        } else {
            tabIndex = "-1";
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
         * and wee need to keep the current form element in view, by scrolling it into view
         * */
        if (this.props.selectedFields[0]) {
            let selectedFormElement = document.querySelector('.selectedFormElement');
            if (selectedFormElement) {
                selectedFormElement.focus();
            }
            this.updateScrollLocation();
        }
    }

    keyboardMoveFieldUp() {
        if (this.props.formId && this.props.selectedFields[0].elementIndex !== 0) {
            this.props.keyBoardMoveFieldUp(this.props.formId, this.props.selectedFields[0]);
        }
    }

    keyboardMoveFieldDown() {
        if (this.props.selectedFields && this.props.selectedFields[0].elementIndex < this.props.currentForm.formData.formMeta.fields.length - 1) {
            this.props.keyboardMoveFieldDown(this.props.formId, this.props.selectedFields[0]);
        }
    }

    getSelectedFormElementContainer() {
        let selectedFormElement = document.querySelector('.selectedFormElement');
        if (selectedFormElement) {
            return selectedFormElement.getBoundingClientRect();
        }
    }

    scrollElementIntoView() {
        let selectedFormElement = document.querySelector('.selectedFormElement');
        if (selectedFormElement) {
            document.querySelector('.selectedFormElement').scrollIntoView(true);
        }
    }

    updateScrollLocation() {
        if (this.props.selectedFields[0]) {
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

        if (this.props.selectedFields[0]) {
            isCurrentlySelectedField = this.props.location.elementIndex !== this.props.selectedFields[0].elementIndex;
        }

        if ((e.which === 13 || e.which === 32) && isCurrentlySelectedField) {
            this.onClickField(e);
        }
    }

    render() {
        let tabIndex = this.props.tabIndex;

        let isSmall = Breakpoints.isSmallBreakpoint();
        let classNames = ['fieldEditingTools'];
        let isTouch = Device.isTouch();


        if (isTouch && !isSmall) {
            classNames.push('isTablet');
        } else if (!isTouch) {
            classNames.push('notTouchDevice');
        }

        if (this.props.isDragging) {
            classNames.push('active');
        }

        if (this.isFieldSelected()) {
            classNames.push('selectedFormElement');
        }

        return (
            <div
                tabIndex={tabIndex}
                role="button"
                className={classNames.join(' ')}
                onClick={this.onClickField}
                onKeyDown={this.selectedCurrentField}
            >
                <ReKeyboardShortcuts id="fieldEditingTools" shortcutBindings={[
                    {key: 'up', callback: () => {this.keyboardMoveFieldUp(); return false;}},
                    {key: 'down', callback: () => {this.keyboardMoveFieldDown(); return false;}},
                ]}/>

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
    formId: 'view',
};


const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || 'view');
    let currentForm = state.forms.find(form => form.id === formId);
    let tabIndex = currentForm.formBuilderChildrenTabIndex ? currentForm.formBuilderChildrenTabIndex[0] : "-1";
    let selectedFields = (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields : []);
    return {
        currentForm,
        selectedFields,
        tabIndex
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectField(formId, location) {
            return dispatch(selectFieldOnForm(formId, location));
        },

        keyBoardMoveFieldUp(formId, location) {
            return dispatch(keyBoardMoveFieldUp(formId, location));
        },

        keyboardMoveFieldDown(formId, location) {
            return dispatch(keyboardMoveFieldDown(formId, location));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldEditingTools);
