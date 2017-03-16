import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import ReIcon from '../reIcon/reIcon';

// IMPORTED FROM CLIENT REACT
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
// IMPORTED FROM CLIENT REACT

/**
 * A global action (ex. 'Help' with an icon and an associated link) */
const ReGlobalAction = props => (
    <li className="link globalAction">
        <Link className="globalActionLink" tabIndex={props.tabIndex} to={props.action.link}>
            <ReIcon icon={props.action.icon}/>
            <span className="navLabel"><I18nMessage message={props.action.msg}/></span>
        </Link>
    </li>
);

const actionPropType = PropTypes.shape({
    icon: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    link: PropTypes.string
});

ReGlobalAction.propTypes = {
    /**
     * An object that describes the action ({icon, msg, link}) */
    action: actionPropType.isRequired,

    tabIndex: PropTypes.number.isRequired
};

export default ReGlobalAction;
