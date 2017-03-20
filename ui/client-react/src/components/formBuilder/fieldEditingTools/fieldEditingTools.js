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

        this.tabIndex = "-1";
        this.fieldEditingTools = null;

        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickFieldPreferences = this.onClickFieldPreferences.bind(this);
        this.onClickField = this.onClickField.bind(this);
        this.isFieldSelected = this.isFieldSelected.bind(this);
        this.renderActionIcons = this.renderActionIcons.bind(this);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.keyboardMoveFieldUp = this.keyboardMoveFieldUp.bind(this);
        this.keyboardMoveFieldDown = this.keyboardMoveFieldDown.bind(this);
        this.scrollElementIntoView = this.scrollElementIntoView.bind(this);
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
        if (this.props.selectedFields[0]) {
            let selectedFormElement = document.querySelector('.selectedFormElement');
            selectedFormElement.focus();
            this.scrollElementIntoView();
        }
    }

    keyboardMoveFieldUp(formId, currentLocation) {
        if (currentLocation && currentLocation.elementIndex !== 0) {
            this.props.keyBoardMoveFieldUp(formId, currentLocation);
        }
    }

    keyboardMoveFieldDown(formId, currentLocation) {
        if (currentLocation && currentLocation.elementIndex !== this.props.currentForm.formData.formMeta.fields.length - 1) {
            this.props.keyboardMoveFieldDown(formId, currentLocation);
        }
    }

    scrollElementIntoView() {
        if (this.props.selectedFields[0]) {
            let selectedFormElement = document.querySelector('.selectedFormElement').getBoundingClientRect();
            let absoluteElementTop = selectedFormElement.top + window.pageYOffset;
            let bottom = absoluteElementTop + selectedFormElement.height;

            if (bottom > window.innerHeight - 40) {
                document.querySelector('.selectedFormElement').scrollIntoView(true);
            } else if (absoluteElementTop < 50) {
                document.querySelector('.selectedFormElement').scrollIntoView(true);
            }
        }
    }

    handleKeyDown(e) {
        if (e.which === 32) {
            this.onClickField(e);
            e.preventDefault();
        }
    }

    render() {
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
                tabIndex="0"
                role="button"
                className={classNames.join(' ')}
                onClick={this.onClickField}
                onKeyDown={this.handleKeyDown}
                ref={fieldEditingTools => this.fieldEditingTools = fieldEditingTools}
            >
                <ReKeyboardShortcuts id="fieldEditingTools" shortcutBindings={[
                    {key: 'up', callback: () => {this.keyboardMoveFieldUp(this.props.formId, this.props.selectedFields[0]); return false;}},
                    {key: 'down', callback: () => {this.keyboardMoveFieldDown(this.props.formId, this.props.selectedFields[0]); return false;}}
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
