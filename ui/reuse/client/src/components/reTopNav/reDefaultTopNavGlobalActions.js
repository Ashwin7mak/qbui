import React from 'react';
import QBicon from '../../../../../client-react/src/components/qbIcon/qbIcon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
import Locale from '../../../../../client-react/src/locales/locales';
import * as CompConsts from '../../../../../client-react/src/constants/componentConstants';
import {NotificationManager} from 'react-notifications';
import WindowLocationUtils from '../../../../../client-react/src/utils/windowLocationUtils';
import GlobalAction from '../reGlobalActions/reGlobalActions';


import "./reDefaultTopNavGlobalActions.scss";

const actionPropType = React.PropTypes.shape({
    icon: React.PropTypes.string.isRequired,
    msg: React.PropTypes.string.isRequired,
    link: React.PropTypes.string
});

/**
 * The default TopNav global actions that are consistent across functional areas of the qbase app */
let GlobalActions = React.createClass({
    propTypes: {
        linkClass: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        position: React.PropTypes.string,
        actions: React.PropTypes.arrayOf(actionPropType),
        dropdownIcon: React.PropTypes.string,
        dropdownMsg: React.PropTypes.string,
        startTabIndex: React.PropTypes.number,
        app: React.PropTypes.object,

        changeLocale: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            dropdownMsg: 'globalActions.user',
            dropdownIcon: 'user',
            position: 'bottom',
            startTabIndex: 0,
            actions: [],
        };
    },

    changeLocale: function(locale) {
        if (this.props.changeLocale) {
            this.props.changeLocale(locale);
        }
    },

    /**
     * sign out user using explicit nav
     * (MenuItem href is currently incompatible with react-fastclick) */
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

                    <MenuItem eventKey={eventKeyIdx++} disabled>
                        <I18nMessage message={'header.menu.preferences'}/>
                    </MenuItem>

                    {this.props.changeLocale && supportedLocales.length > 1 && <MenuItem divider/>}

                    {this.props.changeLocale && supportedLocales.length > 1 ? supportedLocales.map((locale) => {
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

                    {this.props.actions && this.props.actions.map((action, index) => (
                        <GlobalAction
                            tabIndex={this.props.startTabIndex + index}
                            key={action.msg}
                            linkClass={this.props.linkClass}
                            onSelect={this.props.onSelect}
                            action={action}
                        />
                    ))}
                </ul>
            </div>
        );
    }
});

export default GlobalActions;
