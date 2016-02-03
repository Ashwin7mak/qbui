import React from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Link} from 'react-router';
import NavItem from './navItem';

let TablesList = React.createClass({

    propTypes: {
        selectedAppId: React.PropTypes.string.isRequired,
        open: React.PropTypes.bool.isRequired,
        onSelect: React.PropTypes.func,
        showReports: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <div className="tablesList leftNavList">

                <ul>
                    <NavItem item={{msg: 'nav.home', link:'/app/' + this.props.selectedAppId, icon:'home'}} {...this.props} />
                    <NavItem item={{msg: 'nav.users', link:'/users', icon:'user'}} {...this.props}/>
                    <NavItem item={{msg: 'nav.favorites', link:'/favorites', icon:'star'}} {...this.props}/>

                    <NavItem item={{msg: 'nav.tablesHeading'}} isHeading={true} {...this.props}/>
                    {this.props.getAppTables(this.props.selectedAppId).map((table) => {
                        table.link = '/app/' + this.props.selectedAppId + '/table/' + table.id;
                        table.icon = 'heart';
                        return <NavItem item={table}
                                        key={table.id}
                                        secondaryIcon={"list"}
                                        secondaryOnSelect={this.props.showReports}
                                        {...this.props}/>;
                    })}
                </ul>
            </div>
        );
    }
});

export default TablesList;
