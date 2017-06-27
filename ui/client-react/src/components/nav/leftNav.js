import React, {PropTypes, Component} from 'react';
import Swipeable from 'react-swipeable';
import Loader  from 'react-loader';
import AppsList from './appsListForLeftNav';
import TablesList from './tablesList';
import './leftNav.scss';
import AppUtils from '../../utils/appUtils';
import * as SpinnerConfigurations from "../../constants/spinnerConfigurations";
import LogoImg from '../../../../reuse/client/src/assets/images/QB3-logo.svg';
import {APPS_ROUTE} from '../../constants/urlConstants';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import NavHeader from 'REUSE/components/navHeader/navHeader';
import {AVAILABLE_ICON_FONTS} from 'REUSE/components/icon/icon';
import _ from 'lodash';

class LeftNav extends Component {
    static propTypes = {
        expanded: PropTypes.bool,
        visible: PropTypes.bool,
        isAppsListOpen: PropTypes.bool.isRequired,
        selectedAppId: PropTypes.string,
        selectedApp: PropTypes.object,
        selectedTableId: PropTypes.string,
        onToggleAppsList: PropTypes.func,
        onSelect: PropTypes.func,
        onSelectReports: PropTypes.func,
        onCreateNewTable: PropTypes.func,
        globalActions: PropTypes.element,
        isAppLoading: PropTypes.bool,
        onAppsRoute: PropTypes.bool
    };

    static defaultProps = {
        expanded: true,
        visible: true
    };

    /**
     * create apps toggle section (if an app is selected)
     */
    createAppsToggleArea = () => {
        const {selectedApp, isAppLoading, onToggleAppsList, isAppsListOpen, onAppsRoute, expanded} = this.props;

        // If there isn't an app selected, we don't want to show any icon.
        // However, if there is an app that doesn't have an icon, we want to provide a default.
        const appIcon = selectedApp ? _.get(selectedApp, 'icon', 'favicon') : null;

        // The default favicon is in the default fonts (also if 'favicon' is selected as app icon);
        // however, all selected app icons are in the TABLE_STURDY font
        const iconFont = (appIcon && appIcon !== 'favicon') ? AVAILABLE_ICON_FONTS.TABLE_STURDY : AVAILABLE_ICON_FONTS.DEFAULT;

        const hideHeader = isAppLoading || !selectedApp;

        return (
            <div className="appsToggleArea">
                <NavHeader
                    icon={appIcon}
                    iconFont={iconFont}
                    title={_.get(selectedApp, 'name', '')} // navLabel
                    backgroundColor={_.get(selectedApp, 'color', null)}
                    onClickHeader={onToggleAppsList}
                    isToggleDown={!isAppsListOpen}
                    isSmall={onAppsRoute}
                    isToggleVisible={!hideHeader}
                    isVisible={!hideHeader}
                    isCollapsed={!expanded}
                />
            </div>
        );
    };

    reloadAppsPage() {
        const origin = WindowLocationUtils.getOrigin();
        const link = `${origin}${APPS_ROUTE}`;
        WindowLocationUtils.update(link);
    }

    /**
     * create a branding section
     * At some point in the future, customers will be able to specify their own branding image.
     * This is why we kept this as a method instead of coding it down in render();
     */
    createBranding = () => {
        return (<div className="branding" onClick={this.reloadAppsPage}>
            <img className="logo" alt="QuickBase" src={LogoImg} />
        </div>);
    };

    onSelectApp = () => {
        this.props.onToggleAppsList(false);
    };

    swipedLeft = () => {
        this.props.onNavClick();
    };

    renderNavContent = () => {
        // Show the apps list if the apps list is open or if the currently selected app does not exist (So a user can choose a different app)
        if (this.props.isAppsListOpen || !this.props.selectedApp) {
            return <AppsList {...this.props} key="apps" onSelectApp={this.onSelectApp}/>;
        } else {
            return <TablesList key="tables"
                               expanded={this.props.expanded}
                               showReports={(id)=>{this.props.onSelectReports(id);} }
                               getAppTables={AppUtils.getAppTables}
                               onCreateNewTable={this.props.onCreateNewTable}
                               selectedAppId={this.props.selectedAppId}
                               {...this.props} />;
        }
    };

    render() {
        let classes = "leftNav";
        classes += (this.props.visible ? " open" : " closed");
        classes += (this.props.expanded ? " expanded" : " collapsed");

        return (
            <Swipeable className={classes} onSwipedLeft={this.swipedLeft}>
                {this.createAppsToggleArea()}

                <Loader loadedClassName="transitionGroup" loaded={!this.props.areAppsLoading} options={SpinnerConfigurations.LEFT_NAV_BAR}>
                    {this.renderNavContent()}
                </Loader>

                {this.props.globalActions}

                {this.createBranding()}
            </Swipeable>
        );
    }
}

export default LeftNav;
