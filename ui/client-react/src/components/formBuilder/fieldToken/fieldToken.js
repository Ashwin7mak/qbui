import React, {PropTypes} from 'react';
import FieldUtils from '../../../utils/fieldUtils';

import './fieldToken.scss';

const FieldToken = (props) => {
    let classes = ['fieldToken'];

    if (props.classes && props.classes.length > 0) {
        classes = [...classes, ...props.classes];
    }

    if (props.isDragging) {
        classes.push('fieldTokenDragging');
    }

    return (
        <div className={classes.join(' ')}>
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
};

FieldToken.defaultProps = {
    isDragging: false
};

export default FieldToken;
