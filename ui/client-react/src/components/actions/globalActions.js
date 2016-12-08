import React from 'react';
import Fluxxor from 'fluxxor';
import {Link} from 'react-router';
import QBicon from '../qbIcon/qbIcon';
import {MenuItem, Dropdown, Button} from 'react-bootstrap';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import UrlUtils from '../../utils/urlUtils';
import cookie from 'react-cookie';
import Constants from '../../services/constants';
import CommonCookieUtils from '../../../../common/src/commonCookieUtils';
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
     * Check to see if the cookie Constants.COOKIE.V2TOV3 exists
     * if it does, we need to update the value to include a new name/value pair of appId=1
     * if it doesn't, we need to create a new cookie with the current appId=1 as the name/value pair
     * @param eventKey
     */
    switchToQBClassic(eventKey) {
        let newCookieValue = "";
        let v2tov3Cookie = cookie.load(Constants.COOKIE.V2TOV3);
        if (v2tov3Cookie) {
            //make sure it doesn't exist somehow already
            newCookieValue = CommonCookieUtils.searchCookieValue(v2tov3Cookie, this.props.app.id) ?
                v2tov3Cookie : CommonCookieUtils.addQBClassicNameValuePair(v2tov3Cookie, this.props.app.id, "1");
        } else {
            newCookieValue = CommonCookieUtils.createQBClassicNameValuePair(this.props.app.id, "1");
        }
        //DO NOT EVER DO THIS AGAIN! We should never be overriding how cookie-react saves (which by default ENCODES) the value
        //I am only doing this so that we don't need to change current stack ::shudder::
        //This is not documented for cookie-react, tossing some serious JS grenades here
        var encode = function(string) {return string;};
        cookie.save(Constants.COOKIE.V2TOV3, newCookieValue, {path: '/', encode});
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
                    {this.props.app && this.props.app.id && <MenuItem href={UrlUtils.getQuickBaseClassicLink(this.props.app.id)}
                                                onSelect={this.switchToQBClassic}
                                                 eventKey={eventKeyIdx++}><I18nMessage
                                                message={'appMenu.qbClassicLink'}/></MenuItem>}
                    {this.props.app && <MenuItem divider/>}

                    <MenuItem onClick={this.signOutUser} eventKey={eventKeyIdx++}><I18nMessage
                        message={'header.menu.sign_out'}/></MenuItem>
                </Dropdown.Menu>
            </Dropdown>);
    },
    render() {
        return (
            <div className={"globalActions"}>
                <ul className={"globalActionsList"}>
                    <li className={"link globalAction withDropdown"}>{this.getUserDropdown()}</li>

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
