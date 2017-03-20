import React, {PropTypes, Component} from 'react';
import Swipeable from 'react-swipeable';

import './sideMenuBase.scss';

// CLIENT REACT IMPORTS
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
// CLIENT REACT IMPORTS

/**
 * SideMenuBase creates a panel that appears below the main content.
 * The main content will slide out of the way to reveal the side panel.
 * Heads up: Only use one SideMenuBase component per page for two reasons:
 *   1) More than one breaks the XD pattern for this type of component
 *   2) You may get odd visual effects on some browsers
 * If you need more than one, use a SideTrowser component instead for one or both of your panels.
 */
class SideMenuBase extends Component {
    constructor(props) {
        super(props);

        this.state = {isDocked: true};

        this.screenSizeChanged = this.screenSizeChanged.bind(this);
        this.getSideMenuClasses = this.getSideMenuClasses.bind(this);
        this.getMainBodyClasses = this.getMainBodyClasses.bind(this);
        this.closeOnSwipeLeft = this.closeOnSwipeLeft.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.screenSizeChanged, false);
        this.screenSizeChanged(); // Call the function once to initialize
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
        const {baseClass, pullRight, isCollapsed} = this.props;

        let classes = [`${baseClass}Base`];

        if (this.state.isDocked) {
            classes.push(`${baseClass}Docked`);
        }

        if (pullRight) {
            classes.push(`${baseClass}PullRight`);
        }

        if (isCollapsed) {
            classes.push(`${baseClass}Collapsed`);
        }

        return classes.join(' ');
    }

    getSideMenuClasses() {
        const {baseClass, pullRight, isCollapsed, isOpen} = this.props;

        let classes = [`${baseClass}Content`];

        if (pullRight) {
            classes.push(`${baseClass}PullRight`);
        }

        if (isOpen && !this.state.isDocked) {
            classes.push(`${baseClass}Open`)
        }

        if (isCollapsed) {
            classes.push(`${baseClass}Collapsed`);
        }

        if (this.state.isDocked) {
            classes.push(`${baseClass}Docked`);
        }

        return classes.join(' ');
    }

    getMainBodyClasses() {
        const {baseClass, pullRight, isOpen, isCollapsed} = this.props;

        let classes = [`${baseClass}Main`];

        if (isOpen && !this.state.isDocked) {
            classes.push(`${baseClass}Open`)
        }

        if (pullRight) {
            classes.push(`${baseClass}PullRight`);
        }

        if (isCollapsed) {
            classes.push(`${baseClass}Collapsed`);
        }

        return classes.join(' ');
    }

    closeOnSwipeLeft() {
        if (this.props.onUpdateOpenState) {
            this.props.onUpdateOpenState(false)
        }
    }

    render() {
        return (
            <div className={this.getBaseClasses()}>
                <div className={this.getSideMenuClasses()}>
                    <Swipeable onswipedLeft={this.closeOnSwipeLeft}>
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

// Reusable props for components that are built on SideMenuBase
export const SideMenuBaseProps = {
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
    onUpdateOpenState: PropTypes.func,

    /**
     * Sets the location of the side menu to the right side of the screen if true */
    pullRight: PropTypes.bool,

    /**
     * Determines whether the side menu will dock (stay open) at the medium or large breakpoints.
     * If false, visible behavior is only determined by isOpen.
     * Two warnings about this prop:
     *   1. Careful with this one as it breaks the XD pattern for left navs.
     *   2. If a new prop is passed at runtime, it won't visibly update until the next page resize */
    willDock: PropTypes.bool,
};

SideMenuBase.propTypes = {
    ...SideMenuBaseProps,

    /**
     * Override the css classes to keep the behavior of this component while providing your own styling */
    baseClass: PropTypes.string
};

SideMenuBase.defaultProps = {
    isOpen: false,
    isCollapsed: false,
    pullRight: false,
    willDock: true,
    baseClass: 'sideMenu'
};

export default SideMenuBase;
