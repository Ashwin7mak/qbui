import React from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Link} from 'react-router';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';

let NavItem = React.createClass({

    propTypes: {
        item: React.PropTypes.shape({
            id: React.PropTypes.any,
            msg: React.PropTypes.string,
            name: React.PropTypes.string,
            icon: React.PropTypes.string,
            link: React.PropTypes.string
        }),
        onSelect: React.PropTypes.func,
        isHeading: React.PropTypes.bool,
        secondaryIcon: React.PropTypes.string,
        secondaryOnSelect: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            isHeading: false
        };
    },
    render() {

        const item = this.props.item;

        if (this.props.isHeading) {
            if (this.props.open) {
                return (
                    <li key={item.msg}
                        onClick={this.props.onClick}
                        className={ this.props.secondaryIcon ? "heading withSecondary" : "heading"}>
                        <I18nMessage message={item.msg}/>
                        {this.props.secondaryIcon && <QBicon icon={this.props.secondaryIcon} />}
                    </li>);
            } else {
                return (<li key={item.msg}><a className="heading"></a></li>);
            }
        } else {
            let label = item.name;
            let tooltipID = item.msg ? item.msg : item.name;
            if (item.msg) {
                label = (<I18nMessage message={item.msg}/>);
            }
            const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                      id={tooltipID}>{label}</Tooltip>);
            return (
                <OverlayTrigger key={item.id} placement="right" overlay={tooltip}>
                    <li className={ this.props.secondaryIcon ? "link withSecondary" : "link"}>
                        <Link className="leftNavLink" to={item.link} onClick={this.props.onSelect}>
                            <QBicon icon={item.icon}/> <span className={"leftNavLabel"}>{this.props.open ? label : ""}</span>
                        </Link>
                        { this.props.open && this.props.secondaryIcon &&
                        <a href="#" className="right" onClick={()=>this.props.secondaryOnSelect(item.id)}>
                            <QBicon icon={this.props.secondaryIcon}/>
                        </a> }
                    </li>
                </OverlayTrigger>);
        }
    }
});

export default NavItem;
