import React, {PropTypes} from 'react';
import FieldUtils from '../../../utils/fieldUtils';
import Icon from '../../../../../reuse/client/src/components/icon/icon';

import './fieldToken.scss';

/**
 * This token represents fields while they are in a dragging state.
 * If you need to display a field token in a menu, use `FieldTokenInMenu` instead.
 * @param props
 * @returns {XML}
 * @constructor
 */
const FieldToken = (props) => {
    let selectedId = _.get(props, 'selectedFormElement.id');
    let fieldId = _.get(props, 'containingElement.FormFieldElement.id');

    let classes = ['fieldToken'];

    if (props.classes && props.classes.length > 0) {
        classes = [...classes, ...props.classes];
    }

    if (props.isDragging && fieldId === selectedId) {
        classes.push('fieldTokenDragging');
    }

    if (props.isCollapsed) {
        classes.push('fieldTokenCollapsed');
    }

    // Use the icon prop, otherwise, attempt to get the icon based on the field type
    let icon = props.icon ? props.icon : FieldUtils.getFieldSpecificIcon(props.type);

    return (
        <div className={classes.join(' ')} onClick={props.onClick}>
            <div className="fieldTokenIconContainer">
                <div className="fieldTokenIcon">
                    <Icon icon={icon} />
                </div>
            </div>
            <div className="fieldTokenTitle">
                {props.title}
            </div>
        </div>
    );
};

FieldToken.propTypes = {
    classes: PropTypes.array,
    title: PropTypes.string,

    /**
    * The icon to display on the token. Provide either an icon or a field type. */
    icon: PropTypes.string,

    /**
     * The field type (if this token represents a field). This is optional, but provide either an icon or type. */
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Whether the field token should display with its dragging styles applied */
    isDragging: PropTypes.bool,

    /**
     * Displays the token in a collapsed state (icon only) */
    isCollapsed: PropTypes.bool,

    /**
     * Action when the field token is clicked. */
    onClick: PropTypes.func
};

FieldToken.defaultProps = {
    isDragging: false
};

export default FieldToken;
