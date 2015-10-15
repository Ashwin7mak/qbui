import React from 'react';
import ReactIntl from 'react-intl';
import './apps.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        console.log('getting apps');
        return ( this.props.data.apps.length ?
                <div className="apps">
                    {this.props.data.apps.map((app) => {
                        let appName = app.name + ' (' + app.id + ')';
                        return (
                            <div key={appName}>
                                <li>{appName}</li>
                                <div className="tables">
                                    {app.tables.map((table) => {
                                        let tblName = table.name + ' (' + table.id + ')';
                                        let href = '/app/' + app.id + '/table/' + table.id;
                                        return (
                                            <ul key={table.id}><li><a href={href}>{tblName}</a></li></ul>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div> : <div></div>
        )
    }
});

export default Content;