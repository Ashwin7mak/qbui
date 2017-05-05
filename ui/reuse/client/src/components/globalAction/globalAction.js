import React, {PropTypes} from 'react';
import {Link} from 'react-router-dom';
import Icon from 'REUSE/components/icon/icon';
import {I18nMessage} from 'REUSE/utils/i18nMessage';

/**
 * A global action (ex. 'Help' with an icon and an associated link) */
const GlobalAction = props => (
    <li className="link globalAction">
        <Link className="globalActionLink" tabIndex={props.tabIndex || 0} to={props.action.link}>
            <Icon icon={props.action.icon}/>
            <span className="navLabel"><I18nMessage message={props.action.msg}/></span>
        </Link>
    </li>
);

const actionPropType = PropTypes.shape({
    icon: PropTypes.string.isRequired,
    msg: PropTypes.string.isRequired,
    link: PropTypes.string
});

GlobalAction.propTypes = {
    /**
     * An object that describes the action ({icon, msg, link}) */
    action: actionPropType.isRequired,

    tabIndex: PropTypes.number
};

export default GlobalAction;
