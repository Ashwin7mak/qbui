import React, {PropTypes} from 'react';
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
 *
 * Lifecycle of this component:
 * 1> initial render                                                          <ReactCSSTransitionGroup>     <Drawer>
 *    render an invisible <ReactCSSTransitionGroup> with no inner child,       |     display:none               null
 *    ReactCSSTransitionGroup is invisible using display:none                  |
 *                                                                             |
 * 2> slide the drawer in                                                      |
 *    when a route change dictates that we need to render a drawer,            |       visible                rendered
 *    setState({visible: true}), this is currently done in                     |
 *    componentWillReceiveProps. Once we have the router, we probably          |
 *    will get rid of componentWillReceiveProps.                               |
 *    The drawer will slide in. ReactCSSTransitionGroup is visible.            |
 *                                                                             |
 * 3> slide the drawer out                                                     |
 *    drawer slides out > after drawer slides out, ReactCSSTransitionGroup     |      visible                 rendered
 *    is still visible but the drawer is off screen                            |
 *                                                                             |
 * 4> ReactCSSTransitionGroup unmounts the drawer                              |
 *    drawer component will call ComponentWillUnmount, which then calls        |      visible                unmounting
 *    closeInvisiblePane                                                       |
 *                                                                             |
 * 5> closeInvisiblePane called on DrawerContainer                             |
 *    this.state.visible is set to false, we can make ReactCSSTransitionGroup  |    display:none                null
 *    invisible so you can click                                               |
 *
 * We do all this shenanigan because we need ReactCSSTransitionGroup visible at step (4), and invisible at (1) and (5).
 * If we don't use this.state.visible and set to false in a callback at step (5), we never see the drawer slide out.
 * Which is because display:none is not a transitionable property.
 */
class DrawerContainer extends React.Component {
    constructor(props) {
        super(props);
        /* visible is initially set to false. We set this to true when we slide in a child drawer for the first time.
         *
         */
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
        // TODO: Once we integrate with the router, `getDrawer` will return:
        //           <Route path={/*something*/} component={component}>

        if (this.props.hasDrawer) {
            const params = {
                appId:'0duiiaaaaap',
                tblId:'0duiiaaaaa2',
                recordId:'3'
            };
            const component = (
                <Drawer key={1} unmount={this.closeInvisiblePane}>
                    <RecordRouteWithUniqueId
                        {...this.props}
                        isDrawerContext={true}
                        hasDrawer={true}
                        params={params}
                        />
                </Drawer>);
            return component;
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
        //classNames.push(this.state.visible ? 'visible' : '');

        const drawer = this.getDrawer();
        classNames.push(drawer ? 'visible' : '');

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
                    {drawer}
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
