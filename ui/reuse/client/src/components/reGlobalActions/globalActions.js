import React from 'react';
import Fluxxor from 'fluxxor';
import {Link} from 'react-router';
import QBicon from '../qbIcon/qbIcon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import UrlUtils from '../../utils/urlUtils';
import cookie from 'react-cookie';
import CookieConstants from '../../../../common/src/constants';
import CommonCookieUtils from '../../../../common/src/commonCookieUtils';
import * as CompConsts from '../../constants/componentConstants';
import {NotificationManager} from 'react-notifications';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import "./globalActions.scss";
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

    render() {
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
        dropdownMsg: React.PropTypes.string,
        startTabIndex: React.PropTypes.number.isRequired,
        app: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            dropdownIcon: 'fries',
            dropdownMsg: ''
        };
    },

    changeLocale: function(locale) {
        let flux = this.getFlux();
        flux.actions.changeLocale(locale);
    },

    /**
     * sign out user using explicit nav
     * (MenuItem href is currently incompatible with react-fastclick)
     */
    signOutUser() {
        WindowLocationUtils.update("/qbase/signout");
    },

    getUserDropdown() {
        let supportedLocales = Locale.getSupportedLocales();
        let eventKeyIdx = 20;
        return (
            <Dropdown id="nav-right-dropdown" dropup={this.props.position === "left"}>

                <a bsRole="toggle"
                        className={"dropdownToggle globalActionLink"}
                        tabIndex={this.props.startTabIndex + this.props.actions.length}>
                    <QBicon icon={this.props.dropdownIcon}/>
                    <span className={"navLabel"}>{this.props.dropdownMsg !== '' ? <I18nMessage message={this.props.dropdownMsg}/> : ''}</span>
                </a>

                <Dropdown.Menu>

                    <MenuItem eventKey={eventKeyIdx++} disabled><I18nMessage

                        message={'header.menu.preferences'}/></MenuItem>
                    <MenuItem divider/>

                    {supportedLocales.length > 1 ? supportedLocales.map((locale) => {
                        return <MenuItem href="#" className="localeLink" onSelect={() => this.changeLocale(locale)} title={locale}
                                         key={eventKeyIdx} eventKey={eventKeyIdx++}><I18nMessage
                            message={'header.menu.locale.' + locale}/></MenuItem>;
                    }) : null}
                    {supportedLocales.length > 1 ? <MenuItem divider/> : null}

                    {this.props.app && <MenuItem disabled><span className="appMenuHeader">{this.props.app.name}</span></MenuItem>}
                    {this.props.app && <MenuItem divider/>}

                    <MenuItem onClick={this.signOutUser} eventKey={eventKeyIdx++}><I18nMessage
                        message={'header.menu.sign_out'}/></MenuItem>
                </Dropdown.Menu>
            </Dropdown>);
    },

    getHelpWalkme() {
        let touch = "ontouchstart" in window;
        if (touch) {
            return;
        }
        try {
            WalkMePlayerAPI.toggleMenu();
        } catch (err) {
            NotificationManager.info(Locale.getMessage('missingWalkMe'), '', CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
        }
    },

    getHelpLink() {
        return (
            <a className="dropdownToggle globalActionLink" onClick={this.getHelpWalkme}>
                <QBicon icon={'help'}/>
                <span className={"navLabel"}><I18nMessage message={'globalActions.help'}/></span>
            </a>);
    },
    render() {
        /**
         * This removes the hover shadow when the form builder button is disabled
         * */
        return (
            <div className={"globalActions"}>
                <ul className={"globalActionsList"}>
                    {this.props.children}
                    <li className={"link globalAction withDropdown"}>{this.getUserDropdown()}</li>
                    <li className={"link globalAction"}>{this.getHelpLink()}</li>

                    {this.props.actions && this.props.actions.map((action, index) => {
                        return <GlobalAction tabIndex={this.props.startTabIndex + index}
                                             key={action.msg}
                                             linkClass={this.props.linkClass}
                                             onSelect={this.props.onSelect}
                                             action={action}/>;
                    })}
                </ul>
            </div>);
    }
});

export default GlobalActions;
