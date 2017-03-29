import React, {PropTypes, Component} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Loader from 'react-loader';
import FlipMove from 'react-flip-move';
import SideMenuBase from '../sideMenuBase/sideMenuBase';
import TableIcon from '../icon/icon';
import Icon from '../icon/icon';
import Tooltip from '../tooltip/tooltip';
import SimpleNavItem from '../simpleNavItem/simpleNavItem';

// CLIENT REACT IMPORTS
import {LEFT_NAV_BAR} from '../../../../../client-react/src/constants/spinnerConfigurations';
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
// CLIENT REACT IMPORTS

import QbLogoImage from '../../assets/images/QB-logo.svg';
import './standardLeftNav.scss';

/**
 * A common left navigation panel for use across functional areas.
 * It displays a list of navigation items and optionally has a header that describes the context of the navigation.
 * Use with the commonNavActions and commonNavReducer to show/hide/collapse the leftNav. The action to toggle
 * the leftNav is often passed as a prop to the TopNav in the onNavClick prop.
 */
class StandardLeftNav extends Component {
    constructor(props) {
        super(props);

        this.renderContextHeaderTitle = this.renderContextHeaderTitle.bind(this);
        this.renderContextHeader = this.renderContextHeader.bind(this);
        this.renderNavContent = this.renderNavContent.bind(this);
        this.screenSizeChanged = this.screenSizeChanged.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.screenSizeChanged, false);
        this.screenSizeChanged(); // Call the function once to initialize
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.screenSizeChanged, false);
    }

    screenSizeChanged() {
        this.forceUpdate();
    }

    getMaxCharactersBeforeTooltip() {
        if (Breakpoints.isSmallBreakpoint()) {
            return 27;
        }

        return 17;
    }

    renderContextHeaderTitle() {
        const {contextHeaderTitle} = this.props;

        let contextHeaderTitleElement = <span className="contextHeaderTitle">{contextHeaderTitle}</span>;

        if (contextHeaderTitle && contextHeaderTitle.length > this.getMaxCharactersBeforeTooltip()) {
            return (
                <Tooltip plainMessage={contextHeaderTitle} location="bottom">{contextHeaderTitleElement}</Tooltip>
            );
        }

        return contextHeaderTitleElement;
    }

    renderContextHeader() {
        const {showContextHeader, isContextHeaderSmall, contextHeaderIcon, contextHeaderIconTypeIsTable, showContextHeaderToggle, isContextToggleDown, isCollapsed} = this.props;

        let classes = ['contextHeader'];

        if (!showContextHeader) {
            classes.push('contextHeaderHidden');
        }

        if (isCollapsed) {
            classes.push('contextHeaderCollapsed');
        }

        if (isContextHeaderSmall && !isCollapsed) {
            classes.push('contextHeaderSmall');
        }

        let icon = null;

        return (
            <div className={classes.join(' ')}>
                <Button
                    className="contextHeaderButton"
                    onClick={this.props.onClickContextHeader}
                >
                    {contextHeaderIcon && <Icon icon={contextHeaderIcon} className="contextHeaderIcon" isTableIcon={contextHeaderIconTypeIsTable}/>}

                    {this.renderContextHeaderTitle()}

                    {showContextHeaderToggle && <Icon icon="caret-up" className={`contextHeaderToggle ${isContextToggleDown ? 'contextToggleDown' : ''}`} />}
                </Button>
            </div>
        );
    }

    renderPrimaryActions() {
        const {navItems, isCollapsed} = this.props;
        return (
            <ul className={`standardLeftNavPrimaryActions ${isCollapsed ? 'standardLeftNavPrimaryActionsCollapsed' : ''}`}>
                {navItems.filter(navItem => navItem.isPrimaryAction).map((navItem, index) => (
                    <li key={index} className="primaryAction"><SimpleNavItem isCollapsed={isCollapsed} {...navItem} /></li>
                ))}
            </ul>
        );
    }

    renderNavContent() {
        const {className, isCollapsed, showLoadingIndicator, globalActions, brandingImage, brandingImageAltText, navItems} = this.props;

        return (
            <div className={`standardLeftNav ${className} ${isCollapsed ? 'isCollapsedStandardLeftNav' : ''}`}>
                {this.renderContextHeader()}

                {this.renderPrimaryActions()}

                <Loader loadedClassName="standardLeftNavItems" loaded={!showLoadingIndicator} options={LEFT_NAV_BAR}>
                    <FlipMove typeName="ul" className="standardLeftNavItemsList">
                        {navItems.filter(navItem => !navItem.isPrimaryAction).map((navItem, index) => (
                            <li key={index}><SimpleNavItem isCollapsed={isCollapsed} {...navItem} /></li>
                        ))}
                    </FlipMove>
                </Loader>

                {Breakpoints.isSmallBreakpoint() && globalActions}

                <div className="standardLeftNavBranding">
                    <img className="leftNavLogo" alt={brandingImageAltText} src={brandingImage} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <SideMenuBase
                sideMenuContent={this.renderNavContent()}
                isOpen={this.props.isOpen}
                isCollapsed={this.props.isCollapsed}
                onUpdateOpenState={this.props.onUpdateOpenState}
                pullRight={false}
            >
                {this.props.children}
            </SideMenuBase>
        );
    }

}

StandardLeftNav.propTypes = {
    /**
     * An optional className to add for custom styling of the current instance of the component. Added to top level div. */
    className: PropTypes.string,

    /**
     * Boolean value that indicates whether the nav is open. Only affects small breakpoints. */
    isOpen: PropTypes.bool,

    /**
     * Sometimes, the left nav needs to open or close itself (e.g., on some touch events, when the screen size changes).
     * This callback will fire when the left nav needs to open or close itself. The response should be to update the state that is controlling isOpen. */
    onUpdateOpenState: PropTypes.func,

    /**
     * Indicates whether the nav should be displayed in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Indicates whether the main body of the navigation should be shown in a loading state (spinner instead of nav link items) */
    showLoadingIndicator: PropTypes.bool,

    /**
     * The context header is the top part of the nav bar. It can be used to display the context of the navigation (e.g., the current app). */
    showContextHeader: PropTypes.bool,

    /**
     * In some XD specs, the contextHeaderIcon and contextHeaderTitle are on the same line. Set this to true to see that effect. */
    isContextHeaderSmall: PropTypes.bool,

    /**
     * The icon for the context header. */
    contextHeaderIcon: PropTypes.string,

    /**
     * The icon for the context header is a table icon (false means its a normal QBIcon). Table Icons have a slightly different format */
    contextHeaderIconTypeIsTable: PropTypes.bool,

    /**
     * The title text for the context header. */
    contextHeaderTitle: PropTypes.element,

    /**
     * Whether to display that toggle button on the context header */
    showContextHeaderToggle: PropTypes.bool,

    /**
     * Controls the direction of the toggle icon in the header. True for down. False for up. */
    isContextToggleDown: PropTypes.bool,

    /**
     * Callback that occurs when the context header is clicked */
    onClickContextHeader: PropTypes.func,

    /**
     * Global actions that will appear on the small breakpoint at the bottom of the nav.
     * Often these are the DefaultTopNavGlobalActions component. */
    globalActions: PropTypes.element,

    /**
     * Pass in an alternate image href for custom branding. E.g., when customers can provide their own branding. */
    brandingImage: PropTypes.string,

    /**
     * The alt text to use with the branding image */
    brandingImageAltText: PropTypes.string,

    /**
     * The nav items to be displayed in the main content area of the left nav */
    navItems: PropTypes.arrayOf(PropTypes.shape({
        // See SimpleNavItem for more information about these props
        // isCollapsed will be automatically passed in based on the state of the leftNav
        isPrimaryAction: PropTypes.bool,
        isSelected: PropTypes.bool,
        icon: PropTypes.string,
        iconFont: PropTypes.string,
        title: PropTypes.string,
        onClick: PropTypes.string,
        href: PropTypes.string,
        link: PropTypes.string,
        secondaryIcon: PropTypes.string,
        secondaryIconFont: PropTypes.string,
        secondaryIconTooltipMsgKey: PropTypes.string,
        onClickSecondaryIcon: PropTypes.string,
        disabled: PropTypes.bool,
        className: PropTypes.string
    })),

    /**
     * Pass in a component to serve as a menu filter */
    menuFilterElement: PropTypes.element,
};

StandardLeftNav.defaultProps = {
    className: '',
    isOpen: false,
    isCollapsed: false,
    showLoadingIndicator: false,
    showContextHeader: false,
    contextHeaderIcon: null,
    contextHeaderTitle: null,
    showContextHeaderToggle: false,
    isContextToggleDown: true,
    brandingImage: QbLogoImage,
    brandingImageAltText: 'QuickBase',
    navItems: [],
};

export default StandardLeftNav;
