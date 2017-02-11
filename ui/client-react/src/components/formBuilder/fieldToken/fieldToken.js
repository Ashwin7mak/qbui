import React, {PropTypes} from 'react';
import FieldUtils from '../../../utils/fieldUtils';

import './fieldToken.scss';

const FieldToken = (props) => {
    return (
        <div className={['fieldToken', ...(props.classes || [])]}>
            <div className="fieldTokenIconContainer">
                <div className="fieldTokenIcon">
                    {FieldUtils.getFieldSpecificIcon(props.type)}
                </div>
            </div>
            <div className="fieldTokenText">
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
