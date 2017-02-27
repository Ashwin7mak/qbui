import React from 'react';
import Swipeable from 'react-swipeable';
import {Tooltip, OverlayTrigger, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import {I18nMessage} from '../../utils/i18nMessage';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import GlobalActions from '../actions/globalActions';
import AppsList from './appsList';
import TablesList from './tablesList';
import QBicon from '../qbIcon/qbIcon';
import './leftNav.scss';
import AppUtils from '../../utils/appUtils';
import * as SpinnerConfigurations from "../../constants/spinnerConfigurations";
import LogoImg from './QB-logo.svg';

let LeftNav = React.createClass({

    propTypes: {
        expanded:React.PropTypes.bool,
        visible:React.PropTypes.bool,
        appsListOpen:React.PropTypes.bool.isRequired,
        selectedAppId:React.PropTypes.string,
        selectedTableId:React.PropTypes.string,
        onToggleAppsList:React.PropTypes.func,
        onSelect:React.PropTypes.func,
        onSelectReports:React.PropTypes.func,
        globalActions:React.PropTypes.element
    },

    getDefaultProps() {
        return {
            expanded: true,
            visible: true
        };
    },

    /**
     * create apps toggle section (if an app is selected)
     */
    createAppsToggleArea() {
        let app = _.find(this.props.apps, {id: this.props.selectedAppId});
        return (<div className="appsToggleArea">
            {this.props.selectedAppId &&
            <Button className="appsToggle" onClick={this.props.onToggleAppsList}>
                <QBicon icon={"favicon"}/>
                <span className={"navLabel"}> {app ? app.name : ''}</span>
                <QBicon className={"appsToggleIcon"} icon="caret-up"/>
            </Button>
            }
        </div>);
    },

    /**
     * create a branding section
     * At some point in the future, customers will be able to specify their own branding image.
     * This is why we kept this as a method instead of coding it down in render();
     */
    createBranding() {
        return (<div className="branding">
            <img className={"logo"} alt="QuickBase" src={LogoImg} />
        </div>);
    },


    onSelectApp() {
        this.props.onToggleAppsList(false);
    },

    swipedLeft() {
        this.props.onNavClick();
    },

    renderNavContent() {
        // Show the apps list if the apps list is open or if the currently selected app does not exist (So a user can choose a different app)
        if (this.props.appsListOpen || !AppUtils.appExists(this.props.selectedAppId, this.props.apps)) {
            return <AppsList key={"apps"} {...this.props} onSelectApp={this.onSelectApp}  />;
        } else {
            return <TablesList key={"tables"} expanded={this.props.expanded} showReports={(id)=>{this.props.onSelectReports(id);} } getAppTables={AppUtils.getAppTables} {...this.props} />;
        }
    },

    render() {
        let classes = "leftNav";
        classes += (this.props.visible ? " open" : " closed");
        classes += (this.props.expanded ? " expanded" : " collapsed");

        if (this.props.appsListOpen) {
            classes += " appsListOpen";
        }

        return (
            <Swipeable className={classes} onSwipedLeft={this.swipedLeft}>
                {this.createAppsToggleArea()}

                <Loader loadedClassName="transitionGroup" loaded={!this.props.appsLoading} options={SpinnerConfigurations.LEFT_NAV_BAR}>
                    {this.renderNavContent()}
                </Loader>

                {this.props.globalActions}

                {this.createBranding()}
            </Swipeable>
        );
    }
});

export default LeftNav;
