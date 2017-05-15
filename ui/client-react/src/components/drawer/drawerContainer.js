import React, {PropTypes} from 'react';
import {Route, withRouter} from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Drawer from './drawer';
import {RecordRouteWithUniqueId} from '../../components/record/recordRoute';

import './drawerContainer.scss';

/**
 * A parent component which orchestrates sliding a drawer in and out of the parent container.
 * We rely on React Router 4's children function, see https://reacttraining.com/react-router/web/api/Route/children-func
 *
 * While the drawerContainer div is visible, the user cannot click on the root record because it's blocked by the
 * invisible backdrop.
 *
 * Lifecycle of this component:                                    match  state.visible  <div drawerContainer>  <Drawer>
 * 1> initial render                                             | -----  -------------  ---------------------  --------
 *    render an invisible <div className="drawerContainer"> with | false      false              hidden           null
 *    <ReactCSSTransitionGroup> as an inner child.               |
 *    ReactCSSTransitionGroup is invisible because the parent    |
 *    node, drawerContainer, has display:none                    |
 *
 * 2> slide the drawer in                                        | true       true              visible         rendered
 *    when a route change dictates that we need to render a      |
 *    drawer, we make drawerContainer visible using              |
 *    setState({visible: true}) which is called by the child     |
 *    drawer during its componentWillMount.                      |
 *    The drawer will slide in.                                  |
 *
 * 3> slide the drawer out                                       | false      true              visible         rendered
 *    When match is null, we will attempt to remove the inner    |
 *    drawer.                                                    |
 *    ReactCSSTransitionGroup will transition the inner drawer   |
 *    off screen.                                                |
 *    The drawer is still visible (off screen) drawerContainer   |
 *    is also still visible because this.state.visible is true.  |
 *
 * 4> ReactCSSTransitionGroup unmounts the drawer                | false      true              hidden           null
 *    drawer component will call ComponentWillUnmount, which     |
 *    calls hideDrawerContainer. DrawerContainer sets            |
 *    visibility to false.                                       |
 *    Now the drawerContainer is invisible and the user's clicks |
 *    will reach the root record.
 *
 * We do all this shenanigan because we need ReactCSSTransitionGroup visible at step (3), and invisible at (1) and (4).
 * If we don't use this.state.visible and only rely on `match`, ReactCSSTransitionGroup will be hidden at (3), which
 * means there will be no transition for the drawer sliding out.
 */

class DrawerContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    /**
     * The inner Drawer component. The key for the Drawer is used by ReactCSSTransitionGroup
     * https://facebook.github.io/react/docs/animation.html
     */
    getDrawer = () => {
        return (
            <Drawer key={1} onMount={this.showDrawerContainer} onUnmount={this.hideDrawerContainer}>
                {this.props.children}
            </Drawer>);
    };

    /**
     * Called by the Drawer component when mounting.
     */
    showDrawerContainer = () => {
        this.setState({visible: true});
    };

    /**
     * Called by the drawer component after it transitions off screen. Set visibility to false so we don't block user
     * interaction with parent record.
     */
    hideDrawerContainer = () => {
        this.setState({visible: false});
    };

    render() {
        const classNames = ['drawerContainer'];
        classNames.push(this.state.visible ? 'visible' : '');
        classNames.push(this.props.direction);

        let closeHandleBackdrop = null;
        // We only need one backdrop to handle closing the drawer containers. Only render for the root drawer instance.
        if (this.props.renderBackdrop && this.props.rootDrawer) {
            classNames.push('rootDrawer');
            closeHandleBackdrop = <div className="closeHandleBackdrop" onClick={this.props.closeDrawer} />;
        }
        const printer = (match) => {
            console.log('printer');
            console.log(JSON.stringify(this.props.match, null, 2));
            console.log(JSON.stringify(match, null, 2));
        };

        // <div className="drawerContainer"> is visible when either `match` is defined or `state.visible` is true
        return (
            <Route
                path={`${this.props.match.url}${this.props.pathToAdd}`}
                children={({match, ...rest}) => (
                    <div className={classNames.join(' ')}>
                        {match && console.log('match' + JSON.stringify(this.props.match, null, 2))}
                        {match && printer(match)}
                        {console.log('drawer ' + this.props.pathToAdd)}
                        {match && closeHandleBackdrop}
                        <ReactCSSTransitionGroup
                            className="slidey-container"
                            transitionName="slidey"
                            transitionAppear={true}
                            transitionAppearTimeout={550}
                            transitionEnterTimeout={550}
                            transitionLeaveTimeout={550}
                            >
                            {match && this.getDrawer()}
                        </ReactCSSTransitionGroup>
                    </div>
                )}
            />);
    }
}

DrawerContainer.defaultProps = {
    direction: 'right',
    renderBackdrop: true
};

DrawerContainer.propTypes = {
    /** whether this is the root drawer instance */
    rootDrawer: PropTypes.bool,
    /** function to call when the user clicks on the backdrop, all drawers should close when called */
    closeDrawer: PropTypes.func,
    /** TODO: */
    direction: PropTypes.oneOf(['right', 'bottom']),
    /** TODO: */
    renderBackdrop: PropTypes.bool
};

export default withRouter(DrawerContainer);
