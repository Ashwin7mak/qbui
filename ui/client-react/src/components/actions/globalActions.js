import React from 'react';
import Fluxxor from 'fluxxor';
import {Link} from 'react-router';
import QBicon from '../qbIcon/qbIcon';
import {MenuItem, Dropdown, Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
let FluxMixin = Fluxxor.FluxMixin(React);

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
        action: actionPropType,
        tabIndex: React.PropTypes.number.isRequired
    },

    render: function() {
        return (
            <li className={"link globalAction"}>
                <Link className={"globalActionLink"} tabIndex={this.props.tabIndex} to={this.props.action.link} onClick={this.props.onSelect}>
                    <QBicon icon={this.props.action.icon}/>
                    <span className={"navLabel"}><I18nMessage message={this.props.action.msg}/></span>
                </Link>
            </li>);
    }
});

/*
 * a list of global actions (user, alerts, help, logout etc.)
 */
let GlobalActions = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        linkClass: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        position: React.PropTypes.string.isRequired,
        actions: React.PropTypes.arrayOf(actionPropType),
        dropdownIcon: React.PropTypes.string,
        startTabIndex: React.PropTypes.number.isRequired
    },

    getDefaultProps() {
        return {
            dropdownIcon: 'fries',
            dropdownMsg: ''
        };
    },

    onSelect: function(ev) {
        let flux = this.getFlux();
        flux.actions.changeLocale(ev.currentTarget.title);
    },
    getGlobalDropdown() {
        let supportedLocales = Locale.getSupportedLocales();
        let eventKeyIdx = 20;
        return (
            <Dropdown id="nav-right-dropdown" dropup={this.props.position === "left"}>

                <Button bsRole="toggle" className={"dropdownToggle globalActionLink"} tabIndex={this.props.startTabIndex + this.props.actions.length}>
                    <QBicon icon={this.props.dropdownIcon}/>
                </Button>

                <Dropdown.Menu>
                    <MenuItem href="/user" eventKey={eventKeyIdx++}><I18nMessage
                        message={'header.menu.preferences'}/></MenuItem>
                    <MenuItem divider/>

                    {supportedLocales.length > 1 ? supportedLocales.map((locale) => {
                        return <MenuItem href="#" className="localeLink" onSelect={this.onSelect} title={locale}
                                         key={eventKeyIdx} eventKey={eventKeyIdx++}><I18nMessage
                            message={'header.menu.locale.' + locale}/></MenuItem>;
                    }) : null}
                    {supportedLocales.length > 1 ? <MenuItem divider/> : null}

                    <MenuItem href="/signout" eventKey={eventKeyIdx++}><I18nMessage
                        message={'header.menu.sign_out'}/></MenuItem>
                </Dropdown.Menu>
            </Dropdown>);
    },
    render: function() {
        return (
            <div className={"globalActions"}>
                <ul className={"globalActionsList"}>
                    {this.props.actions && this.props.actions.map((action, index) => {
                        return <GlobalAction tabIndex={this.props.startTabIndex + index} key={action.msg} linkClass={this.props.linkClass} onSelect={this.props.onSelect} action={action}/>;
                    })}
                    <li className={"link globalAction withDropdown"}>{this.getGlobalDropdown()}</li>
                </ul>
            </div>);
    }
});

export default GlobalActions;
