import React from 'react';
import Fluxxor from 'fluxxor';
import './globalActions.scss';
import {Link} from 'react-router';
import {Glyphicon} from 'react-bootstrap';
import Hicon from '../harmonyIcon/harmonyIcon';

import {I18nMessage} from '../../utils/i18nMessage';

let GlobalAction = React.createClass({

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
