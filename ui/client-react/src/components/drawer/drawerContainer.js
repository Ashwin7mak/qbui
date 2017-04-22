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
    getDrawer = () => {
        return (
            <Drawer key={1} unmount={this.closeInvisiblePane}>
                <RecordRouteWithUniqueId
                    {...this.props}
                    isDrawerContext={true}
                    hasDrawer={true}
                    />
            </Drawer>);
    };

    // TODO: pass a closeDrawers function to drawers, drawers pass close button as a prop to
    //       RecordWrapper, RecordWrapper renders button. YES!
    render() {
        const classNames = ['drawerContainer', this.props.position];

        let closeHandleBackdrop = null;
        if (this.props.rootDrawer) {
            classNames.push('rootDrawer');
            closeHandleBackdrop = <div className="closeHandleBackdrop" onClick={this.props.closeDrawer} />;
        }
        return (
            <Route
                key={this.props.match.url}
                path={`${this.props.match.url}/sr_app_:appId([A-Za-z0-9]+)_table_:tblId([A-Za-z0-9]+)_report_:reportId([A-Za-z0-9]+)_record_:recordId([A-Za-z0-9]+)`}
                children={({match, ...rest}) => (
                    <div className={[...classNames, (match && 'visible')].join(' ')}>
                        {match && closeHandleBackdrop}
                        <ReactCSSTransitionGroup
                            className="slidey-righty"
                            transitionName="slidey-righty"
                            transitionAppear={true}
                            transitionAppearTimeout={1200}
                            transitionEnterTimeout={1200}
                            transitionLeaveTimeout={1200}
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
