import React from 'react';
import Fluxxor from 'fluxxor';
import {Link} from 'react-router';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';


const actionPropType = React.PropTypes.shape({
    icon: React.PropTypes.string.isRequired,
    msg: React.PropTypes.string.isRequired,
    link: React.PropTypes.string
});

/*
 * a global action (ex. 'Help' with an icon and an associated link);
 */
let GlobalAction = React.createClass({
    propTypes: {
        action: actionPropType
    },
    render: function() {
        return (
            <li className={"link globalAction"}>
                <Link className={"globalActionLink"} to={this.props.action.link} onClick={this.props.onSelect}>
                    <QBicon icon={this.props.action.icon}/><span className={"navLabel"}><I18nMessage message={this.props.action.msg}/></span>
                </Link>
            </li>);
    }
});

/*
 * a list of global actions (user, alerts, help, logout etc.)
 */
let GlobalActions = React.createClass({

    propTypes: {
        linkClass: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        actions: React.PropTypes.arrayOf(actionPropType)
    },
    render: function() {
        return (
            <div className={"globalActions"}>
                <ul className={"globalActionsList"}>
                    {this.props.actions && this.props.actions.map((action) => {
                        return <GlobalAction key={action.msg} linkClass={this.props.linkClass} onSelect={this.props.onSelect} action={action}/>;
                    })}
                </ul>
            </div>);
    }
});

export default GlobalActions;
