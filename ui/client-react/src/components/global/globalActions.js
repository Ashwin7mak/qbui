import React from 'react';
import Fluxxor from 'fluxxor';
import {Link} from 'react-router';
import {Glyphicon} from 'react-bootstrap';
import Hicon from '../harmonyIcon/harmonyIcon';
import {I18nMessage} from '../../utils/i18nMessage';

import './globalActions.scss';

let GlobalAction = React.createClass({
    propTypes: {
        action: React.PropTypes.shape({
            icon: React.PropTypes.string.isRequired,
            msg: React.PropTypes.string.isRequired
        })
    },
    render: function() {
        return (
            <li className={"link globalAction"}>
                <Link to={this.props.action.link} onClick={this.props.onSelect}>
                    <Hicon icon={this.props.action.icon}/> <I18nMessage message={this.props.action.msg}/>
                </Link>
            </li>);
    }
});

let GlobalActions = React.createClass({

    propTypes: {
        linkClass: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        actions: React.PropTypes.arrayOf(React.PropTypes.shape({
            icon: React.PropTypes.string.isRequired,
            msg: React.PropTypes.string.isRequired
        }))
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
