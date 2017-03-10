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

        this.state = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '250px',
            width: '250px',
            // Z-index is set above the field so that delete and preference icons can be selected
            // TODO:: Modify z-index below (to 0) the field when the field is selected so that the
            // field itself can be clicked.
            zIndex: 2
        };

        this.setPositionOfFieldEditingTools = this.setPositionOfFieldEditingTools.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickFieldPreferences = this.onClickFieldPreferences.bind(this);
        this.onClickField = this.onClickField.bind(this);
        this.isFieldSelected = this.isFieldSelected.bind(this);
        this.renderActionIcons = this.renderActionIcons.bind(this);
    }

    /**
     * Position the chrome around the sibling field
     * @param editingTools
     */
    setPositionOfFieldEditingTools(editingTools) {
        if (editingTools) {
            let fieldDomElement = ReactDom.findDOMNode(editingTools).nextElementSibling;
            let isSmall = Breakpoints.isSmallBreakpoint();
            let width = isSmall ? 40 : 30;
            let left = isSmall ? 25 : 15;

            let styles = {
                top: `${fieldDomElement.offsetTop - 10}px`,
                left: `${fieldDomElement.offsetLeft - left}px`,
                height: `${fieldDomElement.offsetHeight + (isSmall ? 11 : 26)}px`,
                width: `${fieldDomElement.offsetWidth + width}px`
            };

            this.setState(Object.assign({}, this.state, styles));
        }
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

    componentDidMount() {
        document.getElementsByClassName(`fieldEditingTools ${this.props.location.elementIndex}`)[0].addEventListener('keydown', this.onClickField);
    }

    onClickField(e) {
        console.log('this.props.location: ', this.props.location.elementIndex);
        e.preventDefault();
        if (e.keyCode === 13) {
            this.props.selectField(this.props.formId, this.props.location);
        }
    }

    isFieldSelected() {
        return this.props.selectedFields.find(selectedField => _.isEqual(selectedField, this.props.location));
    }

    renderActionIcons() {
        if (this.props.isDragging) {
            return null;
        }

        return (
            <div className="actionIcons">
                <div className="deleteFieldIcon" onClick={this.onClickDelete}>
                    <QbToolTip i18nMessageKey="builder.formBuilder.removeField">
                        <QbIcon icon="delete" />
                    </QbToolTip>
                </div>

                <div className="fieldPreferencesIcon" onClick={this.onClickFieldPreferences}>
                    <QbToolTip i18nMessageKey="builder.formBuilder.unimplemented">
                        <QbIcon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon="Dimensions"/>
                    </QbToolTip>
                </div>
            </div>
        );
    }

    render() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        let classNames = [`fieldEditingTools ${this.props.location.elementIndex}`];
        let isTouch = Device.isTouch();
        let classNames = ['fieldEditingTools'];

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
                tabIndex="0"
                ref={this.setPositionOfFieldEditingTools}
                style={this.state}
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectField(formId, location) {
            return dispatch(selectFieldOnForm(formId, location));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldEditingTools)
