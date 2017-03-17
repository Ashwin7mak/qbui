import React, {PropTypes, Component} from 'react';
import AVAILABLE_ICON_FONTS from '../../../constants/iconConstants';
import QbIcon from '../../qbIcon/qbIcon';
import QbToolTip from '../../qbToolTip/qbToolTip';
import DragHandle from '../dragHandle/dragHandle';
import Device from '../../../utils/device';
import Breakpoints from '../../../utils/breakpoints';
import {connect} from 'react-redux';
import _ from 'lodash';
import {selectFieldOnForm} from '../../../actions/formActions';
import {moveFieldOnForm} from '../../../actions/formActions';

import ReKeyboardShortcuts from '../../../../../reuse/client/src/components/reKeyboardShortcuts/reKeyboardShortcuts';

import './fieldEditingTools.scss';

/**
 * Adds chrome around a field so that the field can be moved and edited.
 */
export class FieldEditingTools extends Component {
    constructor(props) {
        super(props);

        this.tabIndex = "-1";
        this.keyboardBindings = [];

        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickFieldPreferences = this.onClickFieldPreferences.bind(this);
        this.onClickField = this.onClickField.bind(this);
        this.isFieldSelected = this.isFieldSelected.bind(this);
        this.renderActionIcons = this.renderActionIcons.bind(this);

        this.getCurrentField = this.getCurrentField.bind(this);
        this.getNewLocationForKeyboardUp = this.getNewLocationForKeyboardUp.bind(this);
        this.getNewLocationForKeyboardDown = this.getNewLocationForKeyboardDown.bind(this);

        this.activateKeyboardMovingField = this.activateKeyboardMovingField.bind(this);
        this.keyboardMoveFieldUp = this.keyboardMoveFieldUp.bind(this);
        this.keyboardMoveFieldDown = this.keyboardMoveFieldDown.bind(this);

        this.updateSelectedFieldLocation = this.updateSelectedFieldLocation.bind(this);
    }

    onClickDelete(e) {
        if (this.props.removeField) {
            return this.props.removeField(this.props.location);
        }
        e.preventDefault();
    }

    onClickFieldPreferences(e) {
        if (this.props.onClickFieldPreferences) {
            return this.props.onClickFieldPreferences(this.props.location);
        }
        e.preventDefault();
    }

    onClickField(e) {
        if (this.props.selectField) {
            this.props.selectField(this.props.formId, this.props.location);
        }
        e.preventDefault();
    }

    isFieldSelected() {
        if (this.props.selectedFields) {
            return this.props.selectedFields.find(selectedField => _.isEqual(selectedField, this.props.location));
        }
    }

    renderActionIcons() {
        if (this.props.isDragging) {
            return null;
        }

        if (this.isFieldSelected()) {
            this.tabIndex = "0";
        } else {
            this.tabIndex = "-1";
        }

        return (
            <div className="actionIcons">

                    <div className="deleteFieldIcon">
                        <QbToolTip i18nMessageKey="builder.formBuilder.removeField">
                           <button tabIndex={this.tabIndex} onClick={this.onClickDelete}> <QbIcon icon="delete" /> </button>
                        </QbToolTip>
                    </div>

                    <div  className="fieldPreferencesIcon">
                        <QbToolTip i18nMessageKey="builder.formBuilder.unimplemented">
                            <button tabIndex={this.tabIndex} onClick={this.onClickFieldPreferences}> <QbIcon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon="Dimensions"/> </button>
                        </QbToolTip>
                    </div>
            </div>
        );
    }

    componentDidMount() {
        /**
         * For keyboard, we need to reset the focus, to maintain proper tabbing order;
         * */
        if (this.isFieldSelected()) {
            let dragHandleButtonIndex = this.props.selectedFields[0].elementIndex;
            document.querySelectorAll('button.dragButton')[dragHandleButtonIndex].focus();
        }
    }

    activateKeyboardMovingField() {
        let newKeyboardUpLocation = null;
        let newKeyboardDownLocation = null;
        let currentLocation = null;
        let currentField = null;
        let up = null;
        let down = null;

        currentLocation = this.props.selectedFields[0];
        currentField = this.getCurrentField();

        newKeyboardUpLocation = this.getNewLocationForKeyboardUp(currentLocation);
        newKeyboardDownLocation= this.getNewLocationForKeyboardDown(currentLocation);

        up = {key: 'up', callback: () => {this.keyboardMoveFieldUp(this.props.formId, newKeyboardUpLocation, currentField); return false}};
        down = {key: 'down', callback: () => {this.keyboardMoveFieldDown(this.props.formId, newKeyboardDownLocation, currentField); return false}};

        this.keyboardBindings.push(up, down);
    }

    getNewLocationForKeyboardUp(selectedField) {
        return {
            elementIndex: selectedField.elementIndex - 1,
            columnIndex: selectedField.columnIndex,
            tabIndex: selectedField.tabIndex,
            sectionIndex: selectedField.sectionIndex
        }
    }

    getNewLocationForKeyboardDown(selectedField) {
        return {
            elementIndex: selectedField.elementIndex + 1,
            columnIndex: selectedField.columnIndex,
            tabIndex: selectedField.tabIndex,
            sectionIndex: selectedField.sectionIndex
        }
    }

    getCurrentField() {
        return {
            containingElement: this.props.containingElement,
            element: this.props.containingElement.FormFieldElement,
            location: this.props.location,
            relatedField: this.props.relatedField
        }
    }

    updateSelectedFieldLocation(newLocation) {
        if (this.props.selectField) {
            let currentLocation = this.props.location;

            if (newLocation === 'up') {
                currentLocation.elementIndex = currentLocation.elementIndex - 1;
            } else if (newLocation === 'down') {
                currentLocation.elementIndex = currentLocation.elementIndex + 1;
            }
            this.props.selectField(this.props.formId, currentLocation);
        }

    }

    keyboardMoveFieldUp(formId, newLocation, currentLocation) {
        console.log('newLocation: ', newLocation);
        if (newLocation.elementIndex !== -1) {
            this.props.moveField(formId, newLocation, currentLocation);
        }
        this.updateSelectedFieldLocation('up');
    }

    keyboardMoveFieldDown(formId, newLocation, currentLocation) {
        if (currentLocation.location.elementIndex !== this.props.currentForm.formData.formMeta.fields.length - 1) {
            this.props.moveField(formId, newLocation, currentLocation);
        }
        this.updateSelectedFieldLocation('down');
    }

    render() {
        this.keyboardBindings = [];
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
            this.activateKeyboardMovingField();
        }

        return (
            <div
                className={classNames.join(' ')}
                onClick={this.onClickField}
            >
                <ReKeyboardShortcuts id="formBuilderContainer" shortcutBindings={this.keyboardBindings}/>

                <button className="dragButton" onClick={this.onClickField}>
                    <DragHandle />
                </button>

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
    let selectedFields = (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields : []);
    return {
        currentForm,
        selectedFields
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectField(formId, location) {
            return dispatch(selectFieldOnForm(formId, location));
        },

        moveField(formId, newLocation, draggedItemProps) {
            return dispatch(moveFieldOnForm(formId, newLocation, draggedItemProps));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldEditingTools);
