import React, {PropTypes} from 'react';
import FieldUtils from '../../../utils/fieldUtils';

import './fieldToken.scss';

/**
 * This token represents fields while they are in a dragging state.
 * If you need to display a field token in a menu, use `FieldTokenInMenu` instead.
 * @param props
 * @returns {XML}
 * @constructor
 */
const FieldToken = (props) => {
    let classes = ['fieldToken'];

    if (props.classes && props.classes.length > 0) {
        classes = [...classes, ...props.classes];
    }

    if (props.isDragging) {
        classes.push('fieldTokenDragging');
    }

    if (props.isCollapsed) {
        classes.push('fieldTokenCollapsed');
    }

    return (
        <div className={classes.join(' ')} onClick={props.onClick}>
            <div className="fieldTokenIconContainer">
                <div className="fieldTokenIcon">
                    {FieldUtils.getFieldSpecificIcon(props.type)}
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
    type: PropTypes.string,
    title: PropTypes.string,

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
