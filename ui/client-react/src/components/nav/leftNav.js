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

let LeftNav = React.createClass({

    propTypes: {
        expanded:React.PropTypes.bool.isRequired,
        visible:React.PropTypes.bool.isRequired,
        appsListOpen:React.PropTypes.bool.isRequired,
        selectedAppId:React.PropTypes.string,
        selectedTableId:React.PropTypes.string,
        onToggleAppsList:React.PropTypes.func,
        onSelect:React.PropTypes.func,
        onSelectReports:React.PropTypes.func,
        globalActions:React.PropTypes.element
    },

    /**
     * create a branding section (logo with an apps toggle if an app is selected)
     */
    createBranding() {
        let app = _.findWhere(this.props.apps, {id: this.props.selectedAppId});
        return (<div className="branding">
                    <h2 className={"logo"}>QuickBase</h2>
                    {this.props.selectedAppId &&
                        <Button className="appsToggle" onClick={this.props.onToggleAppsList}>
                            <QBicon icon={"favicon"}/>
                            <span className={"navLabel"}> {app ? app.name : ''}</span>
                            <QBicon className={"appsToggleIcon"} icon="caret-filled-up"/>
                        </Button>
                    }
                </div>);
    },

    getAppTables(appId) {
        let app = _.findWhere(this.props.apps, {id: appId});

        return app ? app.tables : [];
    },

    onSelectApp() {
        this.props.onToggleAppsList(false);
    },

    swipedLeft() {
        this.props.onNavClick();
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
                {this.createBranding()}

                <ReactCSSTransitionGroup transitionName="leftNavList" component="div" className={"transitionGroup"} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {!this.props.selectedAppId || this.props.appsListOpen ?
                        <AppsList key={"apps"} {...this.props} onSelectApp={this.onSelectApp}  /> :
                        <TablesList key={"tables"} expanded={this.props.expanded} showReports={(id)=>{this.props.onSelectReports(id);} } getAppTables={this.getAppTables} {...this.props} /> }

                </ReactCSSTransitionGroup>

                {this.props.globalActions}
            </Swipeable>
        );
    }
});

export default LeftNav;
