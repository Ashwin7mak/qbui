import React, {PropTypes, Component} from 'react';
import ReactDom from 'react-dom';
import AVAILABLE_ICON_FONTS from '../../../constants/iconConstants';
import QbIcon from '../../qbIcon/qbIcon';
import QbToolTip from '../../qbToolTip/qbToolTip';
import DragHandle from '../dragHandle/dragHandle';
import Device from '../../../utils/device';
import Breakpoints from '../../../utils/breakpoints';
import {connect} from 'react-redux';
import _ from 'lodash';
import {selectFieldOnForm} from '../../../actions/formActions';

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
    }

    onClickDelete() {
        if (this.props.removeField) {
            return this.props.removeField(this.props.location);
        }
    }

    onClickFieldPreferences() {
        if (this.props.onClickFieldPreferences) {
            return this.props.onClickFieldPreferences(this.props.location);
        }
    }

    onClickField() {
        if (this.props.selectField) {
            this.props.selectField(this.props.formId, this.props.location);
        }
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

        return (
            <div className="actionIcons">
                <div tabIndex="0" className="deleteFieldIcon" onClick={this.onClickDelete}>
                    <QbToolTip i18nMessageKey="builder.formBuilder.removeField">
                        <QbIcon icon="delete" />
                    </QbToolTip>
                </div>

                <div tabIndex="0" className="fieldPreferencesIcon" onClick={this.onClickFieldPreferences}>
                    <QbToolTip i18nMessageKey="builder.formBuilder.unimplemented">
                        <QbIcon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon="Dimensions"/>
                    </QbToolTip>
                </div>
            </div>
        );
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
                className={classNames.join(' ')}
                onClick={this.onClickField}
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
    formId: 'view',
};


const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || 'view');
    let currentForm = state.forms.find(form => form.id === formId);
    let selectedFields = (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields : []);
    return {
        selectedFields
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectField(formId, location) {
            return dispatch(selectFieldOnForm(formId, location));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldEditingTools);
