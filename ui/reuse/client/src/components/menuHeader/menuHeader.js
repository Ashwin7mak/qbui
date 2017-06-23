import React, {PropTypes, Component} from 'react';
import Breakpoints from 'APP/utils/breakpoints';
import Icon, {AVAILABLE_ICON_FONTS} from 'REUSE/components/icon/icon';
import Tooltip from 'REUSE/components/tooltip/tooltip';
import Button from 'react-bootstrap/lib/Button';
import {Motion, spring} from 'react-motion';

import './menuHeader.scss';

// STYLE Variables
const LARGE_HEIGHT = 90;
const SMALL_HEIGHT = 40;
const DEFAULT_STYLE = {height: SMALL_HEIGHT};
const LETTERS_BEFORE_ELLIPSES = 17;
const LETTERS_BEFORE_ELLIPSES_SMALL_BREAKPOINT = 27;

/**
 * A header that typically appears at the top of LeftNavs (see StandardLeftNav for an example)
 * It can display text along with an icon.
 */
export class MenuHeader extends Component {
    static propTypes = {
        /**
         * The title that appears in the header.
         * The title will automatically be truncated if it is too long. The full title will be visible on hover via tooltip. */
        title: PropTypes.string,

        /**
         * Whether to display that toggle button on the context header */
        isVisible: PropTypes.bool,

        /**
         * In some XD specs, the icon and title are on the same line.
         * Set this to true to see that effect. */
        isSmall: PropTypes.bool,

        /**
         * The icon for the context header. */
        icon: PropTypes.string,

        /**
         * The font set to use for the icon */
        iconFont: PropTypes.string,

        /**
         * Whether to show the toggle button on the menu header */
        isToggleVisible: PropTypes.bool,

        /**
         * Controls the direction of the toggle */
        isToggleDown: PropTypes.bool,

        /**
         * Sets the menu header into a collapsed state
         * (e.g., when the left nav is collapsed to a short width and only shows icons) */
        isCollapsed: PropTypes.bool,

        /**
         * Callback that occurs when the menu header is clicked */
        onClickHeader: PropTypes.func,

        /**
         * A valid hex color (e.g., #74489d) for the background color of the menu header.
         * If not provided, it will use the default purple unless overriden in css. */
        backgroundColor: PropTypes.string
    };

    static defaultProps = {
        isVisible: true,
        icon: null,
        iconFont: AVAILABLE_ICON_FONTS.DEFAULT,
        isToggleVisible: false,
        isToggleDown: true,
        isSmall: true,
        isCollapsed: false
    };

    getMaxCharactersBeforeTooltip() {
        if (Breakpoints.isSmallBreakpoint()) {
            return LETTERS_BEFORE_ELLIPSES_SMALL_BREAKPOINT;
        }

        return LETTERS_BEFORE_ELLIPSES;
    }

    renderMenuHeaderTitle = () => {
        const {title} = this.props;

        let titleElement = <span className="menuHeaderTitle">{title}</span>;

        if (title && title.length > this.getMaxCharactersBeforeTooltip()) {
            return (
                <Tooltip plainMessage={title} location="bottom">{titleElement}</Tooltip>
            );
        }

        return titleElement;
    };

    getNonNumericStyles = () => {
        const styles = {};

        if (this.props.backgroundColor) {
            styles.backgroundColor = this.props.backgroundColor;
        }

        return styles;
    };

    animateStyles = () => {
        let {isSmall, isCollapsed} = this.props;

        let height = DEFAULT_STYLE.height;

        if (!isSmall && !isCollapsed) {
            height = LARGE_HEIGHT;
        }

        return {height: spring(height)};
    };


    render() {
        const {isVisible, isSmall, icon, iconFont, isToggleVisible, isToggleDown, isCollapsed} = this.props;

        let classes = ['menuHeader'];

        if (!isVisible) {
            classes.push('menuHeaderHidden');
        }

        if (isCollapsed) {
            classes.push('menuHeaderCollapsed');
        }

        if (isSmall && !isCollapsed) {
            classes.push('menuHeaderSmall');
        }

        if (icon) {
            classes.push('hasIcon');
        }

        return (
            <Motion defaultStyle={DEFAULT_STYLE} style={this.animateStyles()}>
                {animatedStyle => (
                <div className={classes.join(' ')} style={{...animatedStyle, ...this.getNonNumericStyles()}}>
                    <Button
                        className="menuHeaderButton"
                        onClick={this.props.onClickHeader}
                    >
                        {icon && <Icon icon={icon} iconFont={iconFont} className="menuHeaderIcon" />}

                        {this.renderMenuHeaderTitle()}

                        {(isToggleVisible && !isCollapsed) &&
                        <Icon icon="caret-up" className={`menuHeaderToggle ${isToggleDown ? 'menuToggleDown' : ''}`} />}
                    </Button>
                </div>)}
            </Motion>
        );
    }
}

export default MenuHeader;
