import React from 'react';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';


let TablesList = React.createClass({

    buildTableItem(table) {

        let label = table.name;

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                  id={label}>{label}</Tooltip>);

        return (
            <OverlayTrigger key={table.id} placement="right" overlay={tooltip}>
                <li className={"link"}>
                    <Link className="leftNavLink" to={table.link} onClick={this.props.onSelect}>
                        <Glyphicon glyph={table.icon}/> {this.props.open ? label : ""}
                    </Link>
                    { this.props.open ?
                        <a href="#" className="right" onClick={()=>this.props.showReports(table.id)}><Glyphicon glyph="list"/></a> : ""}
                </li>
            </OverlayTrigger>
        );
    },
    render() {
        return (
            <div className="tablesList leftNavList">

                <ul>
                    {this.props.items ? this.props.items.map((item) => {
                        return item.heading ?
                            this.props.buildHeadingItem(item) :
                            this.props.buildItem(item);
                    }) : null}

                    {this.props.selectedAppId && this.props.buildHeadingItem({key: 'nav.tablesHeading'}, false)}
                    {this.props.selectedAppId && this.props.getAppTables(this.props.selectedAppId).map((table) => {
                        table.link = '/app/' + this.props.selectedAppId + '/table/' + table.id;
                        table.icon = 'book';
                        return this.buildTableItem(table);
                    })}
                </ul>
            </div>
        );
    }
});

export default TablesList;