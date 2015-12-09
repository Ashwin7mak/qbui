import React from 'react';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Hicon from '../harmonyIcon/harmonyIcon';

let TablesList = React.createClass({

    propTypes: {
        buildHeadingItem: React.PropTypes.func.isRequired,
        buildItem: React.PropTypes.func.isRequired,
        selectedAppId: React.PropTypes.string.isRequired,
        open: React.PropTypes.bool.isRequired,
        onSelect: React.PropTypes.func,
        showReports: React.PropTypes.func.isRequired
    },
    buildTableItem(table) {

        let label = table.name;

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                  id={label}>{label}</Tooltip>);
        return (
            <OverlayTrigger key={table.id} placement="right" overlay={tooltip}>
                <li className={"link"}>
                    <Link className="leftNavLink" to={table.link} onClick={this.props.onSelect}>
                        <Hicon icon={table.icon}/> {this.props.open ? label : ""}
                    </Link>
                    { this.props.open ?
                        <a href="#" className="right" onClick={()=>this.props.showReports(table.id)}><Hicon icon="list"/></a> : ""}
                </li>
            </OverlayTrigger>
        );
    },
    render() {
        return (
            <div className="tablesList leftNavList">

                <ul>
                    {this.props.selectedAppId && this.props.buildItem({key: 'nav.home', link:'/app/' + this.props.selectedAppId, icon:'dashboard'})}
                    {this.props.selectedAppId && this.props.buildItem({key: 'nav.users', link:'/users', icon:'customers'})}
                    {this.props.selectedAppId && this.props.buildItem({key: 'nav.favorites', link:'/favorites', icon:'star'})}

                    {this.props.items ? this.props.items.map((item) => {
                        return item.heading ?
                            this.props.buildHeadingItem(item) :
                            this.props.buildItem(item);
                    }) : null}

                    {this.props.selectedAppId && this.props.buildHeadingItem({key: 'nav.tablesHeading'}, false)}
                    {this.props.selectedAppId && this.props.getAppTables(this.props.selectedAppId).map((table) => {
                        table.link = '/app/' + this.props.selectedAppId + '/table/' + table.id;
                        table.icon = 'invoices';
                        return this.buildTableItem(table);
                    })}
                </ul>
            </div>
        );
    }
});

export default TablesList;
