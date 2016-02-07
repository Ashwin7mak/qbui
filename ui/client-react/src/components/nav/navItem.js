import React from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Link} from 'react-router';
import {I18nMessage} from '../../utils/i18nMessage';
import Loader  from 'react-loader';
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
        loadingCheck: React.PropTypes.bool,
        isHeading: React.PropTypes.bool,
        secondaryIcon: React.PropTypes.string,
        secondaryOnSelect: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            isHeading: false,
            loadingCheck: false
        };
    },
    render() {

        const item = this.props.item;

        if (this.props.isHeading) {
            if (this.props.open) {
                return (
                    <li key={item.msg} className="heading"><I18nMessage message={item.msg}/>
                        <Loader scale={.5} right={'90%'} loaded={!this.props.loadingCheck}/>
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
                            <QBicon icon={item.icon}/> {this.props.open ? label : ""}
                        </Link>
                        { this.props.open && this.props.secondaryIcon &&
                        <a href="#" className="right" onClick={()=>this.props.secondaryOnSelect(item.id)}>
                            <QBicon icon="report-menu-3"/>
                        </a> }
                    </li>
                </OverlayTrigger>);
        }
    }
});

export default NavItem;
