import React, {PropTypes, Component} from 'react';
import Swipeable from 'react-swipeable';

import './reSideMenuBase.scss';

// CLIENT REACT IMPORTS
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
// CLIENT REACT IMPORTS

class ReSideMenuBase extends Component {
    constructor(props) {
        super(props);

        this.state = {isDocked: true};

        this.screenSizeChanged = this.screenSizeChanged.bind(this);
        this.getSideMenuClasses = this.getSideMenuClasses.bind(this);
        this.getMainBodyClasses = this.getMainBodyClasses.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.screenSizeChanged, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.screenSizeChanged, false);
    }

    screenSizeChanged() {
        if (this.props.willDock && !Breakpoints.isSmallBreakpoint()) {
            this.setState({isDocked: true});
        } else {
            this.setState({isDocked: false});
        }
    }

    getBaseClasses() {
        let classes = ['reSideMenuBase'];

        if (this.state.isDocked) {
            classes.push('reSideMenuDocked');
        }

        if (this.props.isCollapsed) {
            classes.push('reSideMenuCollapsed');
        }

        return classes.join(' ');
    }

    getSideMenuClasses() {
        let classes = ['reSideMenuContent'];

        if (this.props.pullRight) {
            classes.push('sideMenuPullRight');
        }

        if (this.props.isCollapsed) {
            classes.push('reSideMenuCollapsed');
        }

        return classes.join(' ');
    }

    getMainBodyClasses() {
        let classes = ['reSideMenuMain'];

        if (this.props.isOpen && !this.state.isDocked) {
            classes.push('reSideMenuOpen')
        }

        if (this.props.pullRight) {
            classes.push('sideMenuPullRight');
        }

        if (this.props.isCollapsed) {
            classes.push('reSideMenuCollapsed');
        }

        return classes.join(' ');
    }

    render() {
        return (
            <div className={this.getBaseClasses()}>
                <div className={this.getSideMenuClasses()}>
                    <Swipeable onswipedLeft={() => this.props.onUpdateOpenState(false)}>
                        {this.props.sideMenuContent}
                    </Swipeable>
                </div>
                <div className={this.getMainBodyClasses()}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

ReSideMenuBase.propTypes = {
    /**
     * The content of the side menu. Can be any valid react element. */
    sideMenuContent: PropTypes.element.isRequired,

    /**
     * Boolean value indicating whether the side menu is open or closed. Only applicable on small devices. */
    isOpen: PropTypes.bool,

    /**
     * Displays the panel at a collapsed width. Side menu must be open or docked to be visible. */
    isCollapsed: PropTypes.bool,

    /**
     * Sometimes, the side menu needs to open or close itself (e.g., on some touch events, when the screen size changes).
     * This callback will fire when the component needs to open or close itself. The response should be to update the state that is controlling isOpen. */
    onUpdateOpenState: PropTypes.func.isRequired,

    /**
     * Sets the location of the side menu to the right side of the screen if true */
    pullRight: PropTypes.bool,

    /**
     * Determines whether the side menu will dock (stay open) at the medium or large breakpoints.
     * If false, visible behavior is only determined by isOpen. Careful with this one as it breaks the XD pattern for left navs. */
    willDock: PropTypes.bool

};

ReSideMenuBase.defaultProps = {
    isOpen: false,
    isCollapsed: false,
    pullRight: false,
    willDock: true
};

export default ReSideMenuBase;
