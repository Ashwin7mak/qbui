import React, {PropTypes} from 'react';
import FieldUtils from '../../../utils/fieldUtils';

import './fieldToken.scss';

const FieldToken = (props) => {
    let classes = ['fieldToken'];

    if (props.classes && props.classes.length > 0) {
        classes = [...classes, ...props.classes];
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
    title: PropTypes.string
};

export default FieldToken;
