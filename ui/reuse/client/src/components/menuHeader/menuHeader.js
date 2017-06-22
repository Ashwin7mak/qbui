import React, {PropTypes, Component} from 'react';
import Breakpoints from 'APP/utils/breakpoints';
import Icon, {AVAILABLE_ICON_FONTS} from 'REUSE/components/icon/icon';
import Tooltip from 'REUSE/components/tooltip/tooltip';
import Button from 'react-bootstrap/lib/Button';

import './menuHeader.scss';

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
        isCollapsed: PropTypes.bool
    };

    static defaultProps = {
        isVisible: true,
        icon: null,
        iconFont: AVAILABLE_ICON_FONTS.DEFAULT,
        isToggleVisible: true,
        isToggleDown: true
    };

    getMaxCharactersBeforeTooltip() {
        if (Breakpoints.isSmallBreakpoint()) {
            return 27;
        }

        return 17;
    }

    renderContextHeaderTitle = () => {
        const {title} = this.props;

        let titleElement = <span className="contextHeaderTitle">{title}</span>;

        if (title && title.length > this.getMaxCharactersBeforeTooltip()) {
            return (
                <Tooltip plainMessage={title} location="bottom">{titleElement}</Tooltip>
            );
        }

        return titleElement;
    };

    render() {
        const {isVisible, isSmall, icon, iconFont, isToggleVisible, isToggleDown, isCollapsed} = this.props;

        let classes = ['contextHeader'];

        if (!isVisible) {
            classes.push('contextHeaderHidden');
        }

        if (isCollapsed) {
            classes.push('contextHeaderCollapsed');
        }

        if (isSmall && !isCollapsed) {
            classes.push('contextHeaderSmall');
        }

        if (icon) {
            classes.push('hasIcon');
        }

        return (
            <div className={classes.join(' ')}>
                <Button
                    className="contextHeaderButton"
                    onClick={this.props.onClickContextHeader}
                >
                    {icon && <Icon icon={icon} iconFont={iconFont} className="contextHeaderIcon" />}

                    {this.renderContextHeaderTitle()}

                    {(isToggleVisible && !isCollapsed) &&
                    <Icon icon="caret-up" className={`contextHeaderToggle ${isToggleDown ? 'contextToggleDown' : ''}`} />}
                </Button>
            </div>
        );
    }
}

export default MenuHeader;
