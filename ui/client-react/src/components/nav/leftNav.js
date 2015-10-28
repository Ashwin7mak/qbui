import React from 'react';
import {Nav, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import './leftNav.scss';
import {I18nMessage} from '../../utils/i18nMessage';

let LeftNav = React.createClass({

    getGlyphName(item) {

        if (item.icon) {
            return item.icon;
        } else {
            return 'th-list';
        }
    },

    buildHeadingItem: function(item, loadingCheck) {

        if (this.props.open) {
            return (
                <li key={item.key}>
                    <Loader scale={.5} right={'90%'} loaded={!loadingCheck}/>
                    <a className="heading"><I18nMessage message={item.key}/></a>
                </li>);
        } else {
            return (<li key={item.key}><a className="heading"></a></li>);
        }
    },

    buildNavItem: function(item) {

        let label = item.name;
        if (item.key) {
            label = (<I18nMessage message={item.key}/>);
        }

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                  id={label}>{label}</Tooltip>);

        let selectedClass = item.id && (item.id.toString() === this.props.reportID) ? 'selected' : '';

        return (
            <OverlayTrigger key={label} placement="right" overlay={tooltip}>
                <li className={selectedClass}>
                    <Link className="leftNavLink" to={item.link}>
                        <Glyphicon glyph={this.getGlyphName(item)}/> {label}
                    </Link>
                </li>
            </OverlayTrigger>
        );
    },

    render: function() {

        return (

            <div className={"leftMenu " + (this.props.open ? "open" : "closed")}>

                <Nav stacked activeKey={1}>
                    {this.props.items.map((item) => {
                        return item.heading ?
                            this.buildHeadingItem(item) :
                            this.buildNavItem(item);
                    })}
                    {this.buildHeadingItem({key: 'nav.reportsHeading'}, this.props.reportsData.loading)}
                    {this.props.reportsData.list ? this.props.reportsData.list.map((item) => {
                        return this.buildNavItem(item);
                    }) : ''}

                </Nav>

            </div>

        );
    }
});

export default LeftNav;
