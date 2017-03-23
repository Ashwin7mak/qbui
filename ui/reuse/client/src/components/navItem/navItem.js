import React;
import {Link} from 'react-router';
import Icon, {AVAILABLE_ICON_FONTS} from '../icon/icon';
import Tooltip from '../tooltip/tooltip';

// IMPORTED FROM CLIENT REACT
import {I18nMessage} from '../../../../../client-react/src/utils/i18nMessage';
import A11Utils from '../../../../../client-react/src/utils/a11yUtils';
// IMPORTED FROM CLIENT REACT

const NavItem = React.createClass({

    propTypes: {
        item: React.PropTypes.shape({
            id: React.PropTypes.any,
            msg: React.PropTypes.string,
            name: React.PropTypes.string,
            icon: React.PropTypes.string,

            /**
             * The icon font to use for this nav item. See Icon for available icon font constants. */
            iconFont: React.PropTypes.string,
            link: React.PropTypes.string
        }),
        onSelect: React.PropTypes.func,
        isHeading: React.PropTypes.bool,
        showSecondary: React.PropTypes.bool,
        secondaryIcon: React.PropTypes.string,
        secondaryOnSelect: React.PropTypes.func,
        hoverComponent: React.PropTypes.element,
        showToolTip: React.PropTypes.bool,
        selected: React.PropTypes.bool,

        /**
         * A boolean that will cause the default font to be the Table icon font. The iconFont on the individual nav item will always take precedence. */
        tableIcon: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            showSecondary: true,
            isHeading: false,
            showToolTip: false
        };
    },

    onClick(event) {
        if (this.props.onSelect && A11Utils.isA11yClick(event)) {
            this.props.onSelect(event);
        }
    },
    onHeadingClick(event) {
        if (this.props.onClick && A11Utils.isA11yClick(event)) {
            this.props.onClick(event);
        }
    },
    onSecondaryClick(event, id) {
        if (this.props.secondaryOnSelect && A11Utils.isA11yClick(event)) {
            this.props.secondaryOnSelect(id);
        }
    },

    getIconFont(item) {
        if (item.iconFont) {
            return item.iconFont;
        }

        if (this.props.tableIcon) {
            return AVAILABLE_ICON_FONTS.TABLE_STURDY;
        }

        return AVAILABLE_ICON_FONTS.DEFAULT;
    },

    getLinkItem(item, label) {
        let classes = "link";
        if (this.props.secondaryIcon) {
            classes += " withSecondary";
        }
        if (this.props.selected) {
            classes += " selected";
        }
        return (<li className={classes}>
            <Link className="leftNavLink" to={item.link} onClick={this.onClick} onKeyDown={this.onClick}>
                <Icon iconFont={item.iconFont || AVAILABLE_ICON_FONTS.DEFAULT} icon={item.icon} />
                <span className={"leftNavLabel"}>{label}</span>
            </Link>
            { this.props.showSecondary && this.props.secondaryIcon &&
            <a onClick={(event)=> this.onSecondaryClick(event, item.id)}
               onKeyDown={(event)=> this.onSecondaryClick(event, item.id)}
               className="right">
                <Icon icon={this.props.secondaryIcon}/>
            </a> }
            {this.props.hoverComponent}
        </li>);
    },

    render() {
        const item = this.props.item;

        if (this.props.isHeading) {
            return (
                <li key={item.msg} tabIndex="0"
                    onClick={this.onHeadingClick} onKeyDown={this.onHeadingClick}
                    className={ this.props.secondaryIcon ? "heading withSecondary" : "heading"}>
                    <I18nMessage message={item.msg}/>
                    {this.props.secondaryIcon && <Icon icon={this.props.secondaryIcon} />}
                </li>);
        } else {
            let label = item.name;
            let tooltipID = item.msg ? item.msg : item.name;
            if (item.msg) {
                label = (<I18nMessage message={item.msg}/>);
            }

            // TODO:: I don't think className on tooltip is doing anything. May need a refactor. It was part of the original code here.
            return this.props.showToolTip ?
                <Tooltip key={item.id} placement="right" tipId={tooltipID} className={this.props.showToolTip ? 'leftNavTooltip show' : 'leftNavTooltip'}>
                    {this.getLinkItem(item, label)}
                </Tooltip> : this.getLinkItem(item, label);
        }
    }
});

export default NavItem;
