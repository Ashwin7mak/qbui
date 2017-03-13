import React, {PropTypes, Component} from 'react';
import ReactDom from 'react-dom';
import AVAILABLE_ICON_FONTS from '../../../constants/iconConstants';
import QbIcon from '../../qbIcon/qbIcon';
import QbToolTip from '../../qbToolTip/qbToolTip';
import DragHandle from '../dragHandle/dragHandle';
import Device from '../../../utils/device';
import Breakpoints from '../../../utils/breakpoints';

import './fieldEditingTools.scss';

/**
 * Adds chrome around a field so that the field can be moved and edited.
 */
class FieldEditingTools extends Component {
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
                height: `${fieldDomElement.offsetHeight + (isSmall ? 11 : 6)}px`,
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

        return (
            <div
                className={classNames.join(' ')}
                tabIndex="0"
                ref={this.setPositionOfFieldEditingTools}
                style={this.state}
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
    isDragging: PropTypes.bool
};

export default FieldEditingTools;
