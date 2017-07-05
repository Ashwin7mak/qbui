import React from 'react';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import {Link} from 'react-router-dom';
import {I18nMessage} from '../../utils/i18nMessage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import A11Utils from '../../utils/a11yUtils';

let NavItem = React.createClass({

    propTypes: {
        item: React.PropTypes.shape({
            id: React.PropTypes.any,
            msg: React.PropTypes.string,
            name: React.PropTypes.string,
            link: React.PropTypes.string
        }),
        icon: React.PropTypes.string,
        iconFont: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        isHeading: React.PropTypes.bool,
        showSecondary: React.PropTypes.bool,
        secondaryIcon: React.PropTypes.string,
        secondaryOnSelect: React.PropTypes.func,
        hoverComponent: React.PropTypes.element,
        showToolTip: React.PropTypes.bool,
        selected: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            showSecondary: true,
            isHeading: false,
            showToolTip: false,
            icon: 'favicon',
            iconFont: AVAILABLE_ICON_FONTS.DEFAULT
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

    getLinkItem(item, label) {
        let classes = "link";
        let {icon, iconFont} = this.props;

        if (this.props.secondaryIcon) {
            classes += " withSecondary";
        }

        if (this.props.selected) {
            classes += " selected";
        }

        if (!icon) {
            icon = 'favicon';
            iconFont = AVAILABLE_ICON_FONTS.DEFAULT;
        }

        return (<li className={classes}>
            <Link className="leftNavLink" to={item.link} onClick={this.onClick} onKeyDown={this.onClick}>
                {this.props.icon && <Icon iconFont={iconFont} icon={icon}/>}
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
                    <Icon icon="search" className="nav-search"/>
                    {this.props.secondaryIcon && <Icon icon={this.props.secondaryIcon} />}
                </li>);
        } else {
            let label = item.name;
            let tooltipID = item.msg ? item.msg : item.name;
            if (item.msg) {
                label = (<I18nMessage message={item.msg}/>);
            }
            const tooltip = (<Tooltip className={ this.props.showTooltip ? 'leftNavTooltip show' : 'leftNavTooltip' }
                                      id={tooltipID}>{label}</Tooltip>);

            return this.props.showToolTip ?
                <OverlayTrigger key={item.id} placement="right" overlay={tooltip}>{this.getLinkItem(item, label)}</OverlayTrigger> : this.getLinkItem(item, label);
        }
    }
});

export default NavItem;
