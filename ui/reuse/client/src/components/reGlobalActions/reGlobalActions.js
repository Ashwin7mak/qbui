import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import QBicon from '../../../../../client-react/src/components/qbIcon/qbIcon';
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';

/**
 * A global action (ex. 'Help' with an icon and an associated link) */
const GlobalAction = props => (
    <li className={"link globalAction"}>
        <Link className={"globalActionLink"} tabIndex={props.tabIndex} to={props.action.link} onClick={props.onSelect}>
            <QBicon icon={props.action.icon}/>
            <span className={"navLabel"}><I18nMessage message={props.action.msg}/></span>
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

    tabIndex: PropTypes.number.isRequired
};

export default GlobalAction;
