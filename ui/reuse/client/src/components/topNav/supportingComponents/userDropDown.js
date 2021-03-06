import React, {PropTypes, Component} from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropDown from 'react-bootstrap/lib/Dropdown';
import Icon from 'REUSE/components/icon/icon';
import {I18nMessage} from 'REUSE/utils/i18nMessage';
import {connect} from 'react-redux';
import {getLoggedInUserDropDownText} from '../../../reducers/userReducer';
import './userDropDown.scss';

// Uses defaults messages an icons specific to a user dropdown in the DefaultTopNav
const dropDownIcon = 'user';
const signOutMessage = 'header.menu.sign_out';

/**
 * A default user drop down component for the DefaultTopNav. Includes a User button with a dropdown menu that
 * has the available locales, the app name if available, and a signout button
 * This component was not designed to be reused outside of the ReDefaultTopNavGlobalActions component.
 * @param props
 * @constructor
 */
export class UserDropDown extends Component {
    renderLocalesList = () => {
        const {supportedLocales, changeLocale} = this.props;

        if (!changeLocale || !supportedLocales || supportedLocales.length === 0) {
            return null;
        }

        // Return an array to avoid having to wrap all of this in a div and break the menu display
        return [
            <MenuItem divider key="localeTopMenuDivider"/>,
            ...supportedLocales.map(locale => {
                return (
                    <MenuItem
                        href="#"
                        className="localeLink"
                        onSelect={() => changeLocale(locale)}
                        title={locale}
                        key={locale}
                    >
                        <I18nMessage message={'header.menu.locale.' + locale}/>
                    </MenuItem>
                );
            }),
            <MenuItem divider key="localeBottomMenuDivider"/>
        ];
    };

    render() {
        const {startTabIndex, app, signOutUser} = this.props;

        return (
            <DropDown id="nav-right-dropdown" className="userDropDown globalActionLink" dropup={this.props.shouldOpenMenusUp} pullRight={true}>
                <a bsRole="toggle" className="dropdownToggle" tabIndex={startTabIndex}>
                    <Icon className="userDropDownIcon" icon={dropDownIcon}/>
                    <span className="navLabel">{this.props.loggedInUserDisplay}</span>
                </a>

                <DropDown.Menu>
                    <MenuItem className="preferencesButton" disabled>
                        <I18nMessage message="header.menu.preferences"/>
                    </MenuItem>

                    {this.renderLocalesList()}

                    {app && <MenuItem disabled><span className="appMenuHeader">{app.name}</span></MenuItem>}
                    {app && <MenuItem divider/>}

                    <MenuItem className="signOutButton" onClick={() => signOutUser()}><I18nMessage message={signOutMessage}/></MenuItem>
                </DropDown.Menu>
            </DropDown>
        );
    }
}

UserDropDown.propTypes = {
    app: PropTypes.object,
    supportedLocales: PropTypes.array,
    startTabIndex: PropTypes.number,
    changeLocale: PropTypes.func,
    signOutUser: PropTypes.func,
    shouldOpenMenusUp: PropTypes.bool
};

UserDropDown.defaultPropTypes = {
    supportedLocales: [],
    startTabIndex: 0
};

const mapStateToProps = (state) => ({
    loggedInUserDisplay: getLoggedInUserDropDownText(state)
});

export default connect(
    mapStateToProps,
    null
)(UserDropDown);
