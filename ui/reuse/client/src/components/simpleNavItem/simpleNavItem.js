import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import Icon, {AVAILABLE_ICON_FONTS} from '../icon/icon';
import Tooltip from '../tooltip/tooltip';

// IMPORTS FROM CLIENT REACT
import Device from '../../../../../client-react/src/utils/device';
// IMPORTS FROM CLIENT REACT

import "./simpleNavItem.scss";

/**
 * An element that works well inside a side nav such as the StandardLeftNav component as
 * a navigation element in a list.
 */
class SimpleNavItem extends Component {
    constructor(props) {
        super(props);

        this.onClickNavItem = this.onClickNavItem.bind(this);
        this.renderCollapsedIcon = this.renderCollapsedIcon.bind(this);
        this.renderNavItem = this.renderNavItem.bind(this);
    }

    /**
     * If there is a link, we shouldn't fire off both a a link and an on click event.
     * This method causes the onClick prop to be ignored if there is a link passed in.
     * @param evt
     */
    onClickNavItem(evt) {
        if (!this.props.link && this.props.onClick) {
            this.props.onClick(evt);
        }
    }

    /**
     * Renders the secondary icon. Wraps the icon in a tooltip if secondaryIconTooltip is passed in.
     * Adds a class when on touch devices so the secondary icon is always displayed
     * @returns {XML}
     */
    renderSecondaryIcon() {
        const {secondaryIcon, secondaryIconFont, secondaryIconTooltipMsgKey, onClickSecondaryIcon} = this.props;

        if (!secondaryIcon) {
            return null;
        }

        let icon = <Icon iconFont={secondaryIconFont} icon={secondaryIcon} />;

        // The tooltip is inside the secondary icon div so that the tooltip is always aligned with respect to the icon
        if (secondaryIconTooltipMsgKey) {
            icon = <Tooltip i18nMessageKey={secondaryIconTooltipMsgKey} location="right">{icon}</Tooltip>;
        }

        return (
            <button
                type="button"
                tabIndex="0"
                className={`navItemSecondaryIcon ${Device.isTouch() ? 'navItemSecondaryIconTouch' : ''}`}
                onClick={onClickSecondaryIcon}
            >
                {icon}
            </button>
        );
    }

    /**
     * Try to render an icon if possible. As a backup, render the text, but it will be difficult to read. Prefer an icon.
     * @returns {*}
     */
    renderCollapsedIcon() {
        const {icon, iconFont, secondaryIcon, secondaryIconFont, title} = this.props;

        if (icon) {
            return <Icon className="navItemIcon" iconFont={iconFont} icon={icon} />;
        }

        if (secondaryIcon) {
            return <Icon className="navItemIcon" iconFont={secondaryIconFont} icon={secondaryIcon} />;
        }

        // When there are no icons, default to the nav item text
        return <span className="navItemContent">{title}</span>;
    }

    /**
     * Renders the content of the nav item
     * If the nav item is collapsed it only renders the icon (or text if no icon)
     * TODO:: On hover, it will display the full item (navBodyCollapsedHover element) - https://quickbase.atlassian.net/browse/MC-1382
     * @param isCollapsed This prop is passed in so that when we render the un-collapsed version using the same function
     * @returns {XML}
     */
    renderNavItem(isCollapsed) {
        const {icon, iconFont, title, isPrimaryAction} = this.props;

        const navItemTitle = <span className="navItemContent">{title}</span>;

        const navBody = (
            <div className={`navBody ${isPrimaryAction ? 'primaryNavItem' : ''}`}>
                <div className="navBodyContent">
                    {icon && <Icon className="navItemIcon" iconFont={iconFont} icon={icon} />}
                    {navItemTitle}
                </div>
                {this.renderSecondaryIcon()}
            </div>
        );

        if (isCollapsed) {
            return (
                <div className="navBody navBodyCollapsed">
                    {this.renderCollapsedIcon()}
                </div>
            );
        }

        return navBody;
    }

    getClassName() {
        const {className, isSelected, isDisabled, isPrimaryAction} = this.props;
        let instanceClassName = ['simpleNavItem'];
        if (className) {
            instanceClassName.push(className);
        }

        if (isSelected) {
            instanceClassName.push('navItemSelected');
        }

        if (isDisabled) {
            instanceClassName.push('navItemDisabled');
        }

        if (isPrimaryAction) {
            instanceClassName.push('navItemPrimaryAction');
        }

        return instanceClassName.join(' ');
    }

    /**
     * Renders a nav item
     * If a link is passed in, the item is rendered inside a React-Route Link component.
     * @returns {XML}
     */
    render() {
        if (this.props.link) {
            return (
                <Link className={this.getClassName()} to={this.props.link}>
                    {this.renderNavItem(this.props.isCollapsed)}
                </Link>
            );
        }

        // Use an <a> tag so that this is still picked up as a navigation element by accessibility tools
        return (
            <a
                href={this.props.onClick ? null : this.props.href}
                className={this.getClassName()}
                tabIndex="0"
                onClick={this.onClickNavItem}
                onKeyDown={this.onClickNavItem}
            >

                {this.renderNavItem(this.props.isCollapsed)}
            </a>
        );
    }
}

SimpleNavItem.propTypes = {
    /**
     * A set of actions that sit above the list of nav items. You can use these to call out
     * specific actions. For example, in the Client-React app, a link to view the users of an app lives here.
     * Set to true to designate a nav item as a primary action. */
    isPrimaryAction: PropTypes.bool,

    /**
     * Shows the navItem is a selected state when true */
    isSelected: PropTypes.bool,

    /**
     * Display the nav item in a disabled state and remove links and onClick */
    isDisabled: PropTypes.bool,

    /**
     * Shows the navItem in a collapsed state when true */
    isCollapsed: PropTypes.bool,

    /**
     * The icon that displays on the left side. See the Icon component for more information. */
    icon: PropTypes.string,

    /**
     * Optionally use a different icon font for the primary icon. See Icon component for available fonts. */
    iconFont: PropTypes.string,

    /**
     * The text that displays on the nav item */
    title: PropTypes.string,

    /**
     * Optionally pass a callback that will be called when the nav item is clicked. It receives the click event as its only argument. */
    onClick: PropTypes.func,

    /**
     * Optionally pass a react-router link. If both onClick and link are passed in, link will take precedence. */
    link: PropTypes.string,

    /**
     * If you need a link outside of the current single-page-app/react-router instance, then use href instead.
     * The link and onClick properties will take precedence over href if multiple are passed in. */
    href: PropTypes.string,

    /**
     * The icon that appears on hover on the right side of the nav item
     * On a primary action, the secondary icon appears to the left and is always displayed */
    secondaryIcon: PropTypes.string,

    /**
     * Optionally use a different icon font for the secondary icon. See Icon component for available fonts. */
    secondaryIconFont: PropTypes.string,

    /**
     * Optionally provide an i18nMessage key string to display as a tooltip when hovering over the secondary icon */
    secondaryIconTooltipMsgKey: PropTypes.string,

    /**
     * A callback that will occur when the secondary icon is clicked. It receives the click event as its only argument. */
    onClickSecondaryIcon: PropTypes.func,

    /**
     * Add a custom className to help style your instance of the component */
    className: PropTypes.string,
};

SimpleNavItem.defaultProps = {
    title: '',
    iconFont: AVAILABLE_ICON_FONTS.DEFAULT,
    secondaryIconFont: AVAILABLE_ICON_FONTS.DEFAULT,
    href: null,
};

export default SimpleNavItem;
