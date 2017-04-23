import React, {PropTypes} from 'react';
import {Route} from 'react-router-dom';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Drawer from './drawer';
import {RecordRouteWithUniqueId} from '../../components/record/recordRoute';

import './drawer.scss';

/**
 * A parent component which orchestrates sliding a drawer in and out of the parent container.
 * There are still some things I'm not sure about until I get my hands on the actual router. But for all the odd cases
 * I can think of, I have ideas on how to get around them.
 *
 * I think Route's children prop might come in handy https://reacttraining.com/react-router/web/api/Route/children-func
 */
class DrawerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }
    getDrawer = () => {
        return (
            <Drawer key={1} mount={this.childWillMount} unmount={this.childWillUnmount}>
                <RecordRouteWithUniqueId
                    {...this.props}
                    isDrawerContext={true}
                    hasDrawer={true}
                    />
            </Drawer>);
    };

    childWillMount = () => {
        this.setState({visible: true});
    };

    /**
     * Called by the drawer component after it transitions off screen and is about to unmount. Set visibility to false
     * so we don't block user interaction with parent record.
     */
    childWillUnmount = () => {
        this.setState({visible: false});
    };

    logMatch = (match) => {
        console.log('(re)render log match: ' + JSON.stringify(match));
    };

    logNotMatch = (match) => {
        console.log('(re)render log NOT match: ' + JSON.stringify(match));
    };

    // TODO: pass a closeDrawers function to drawers, drawers pass close button as a prop to
    //       RecordWrapper, RecordWrapper renders button. YES!
    render() {
        const classNames = ['drawerContainer', this.props.position];
        classNames.push(this.state.visible ? 'visible' : '');

        let closeHandleBackdrop = null;
        if (this.props.rootDrawer) {
            classNames.push('rootDrawer');
            closeHandleBackdrop = <div className="closeHandleBackdrop" onClick={this.props.closeDrawer} />;
        }
        return (
            <Route
                path={`${this.props.match.url}/sr_app_:appId([A-Za-z0-9]+)_table_:tblId([A-Za-z0-9]+)_report_:reportId([A-Za-z0-9]+)_record_:recordId([A-Za-z0-9]+)`}
                children={({match, ...rest}) => (
                    <div className={classNames.join(' ')}>
                        {match && closeHandleBackdrop}
                        <ReactCSSTransitionGroup
                            className="slidey-righty"
                            transitionName="slidey-righty"
                            transitionAppear={true}
                            transitionAppearTimeout={1000}
                            transitionEnterTimeout={1000}
                            transitionLeaveTimeout={1000}
                            >
                            {match && this.getDrawer()}
                        </ReactCSSTransitionGroup>
                    </div>
                )}
            />);
    }
}

DrawerContainer.propTypes = {
    /** whether to render a drawer which hovers over background content */
    isDrawer: PropTypes.bool
};

export default DrawerContainer;
