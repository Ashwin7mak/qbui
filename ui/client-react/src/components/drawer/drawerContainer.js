import React, {PropTypes} from 'react';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Drawer from './drawer';
import {RecordRouteWithUniqueId} from '../../components/record/recordRoute';

import './drawer.scss';

/**
 * A parent component which orchestrates stacks of drawers.
 */
class DrawerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasDrawer) {
            this.setState({visible: true});
        }
    }

    /**
     * Close the semi-tranparent panel covering the root recordWapper.
     */
    closeInvisiblePane = () => {
        this.setState({visible: false});
    };

    getDrawer = () => {
        // TODO: handle all the records in url since we'll support multiple drawers
        //       the array or tables/records should not be passed in as props, we should retrieve
        //       or generate the list of records from the router
        if (this.props.hasDrawer) {
            const params = {
                appId:'0duiiaaaaap',
                tblId:'0duiiaaaaa2',
                recordId:'3'
            };
            return (
                <Drawer key={1} unmount={this.closeInvisiblePane}>
                    <RecordRouteWithUniqueId
                        {...this.props}
                        isDrawerContext={true}
                        hasDrawer={true}
                        params={params}
                        />
                </Drawer>);
        } else {
            return null;
        }
    };

    // TODO: pass a closeDrawers function to drawers, drawers pass close button as a prop to
    //       RecordWrapper, RecordWrapper renders button. YES!
    render() {
        const classNames = ['drawerContainer', this.props.position, this.props.className];
        classNames.push(this.props.visible ? 'visible' : '');
        classNames.push(this.props.hasDrawer ? 'visible' : '');
        classNames.push(this.state.visible ? 'visible' : '');
        
        return (
            <div className={classNames.join(' ')} onClick={this.closeDrawers}>
                <ReactCSSTransitionGroup
                    className="slidey-righty"
                    transitionName="slidey-righty"
                    transitionAppear={true}
                    transitionAppearTimeout={1200}
                    transitionEnterTimeout={1200}
                    transitionLeaveTimeout={1200}
                    >
                    {this.getDrawer()}
                </ReactCSSTransitionGroup>

                {this.props.content}
                {this.props.children}
            </div>
        );
    }
}

DrawerContainer.propTypes = {
    /** whether the DrawerContainer is visible */
    visible: PropTypes.bool,
    /** main content of DrawerContainer */
    content: PropTypes.node,
    /** whether to render a drawer which hovers over background content */
    isDrawer: PropTypes.bool
};

export default DrawerContainer;
