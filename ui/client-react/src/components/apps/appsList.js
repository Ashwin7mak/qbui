import React from 'react';
import ReactIntl from 'react-intl';
import './apps.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return ( this.props.data.apps.length ?
            <div className="apps">
                {this.props.data.apps.map((app) => {
                    let appName = app.name + ' (' + app.id + ')';
                    return (
                        <div>
                            <li>{appName}</li>
                            <div className="tables">
                                {app.tables.map((table) => {
                                    let tblName = table.name + ' (' + table.id + ')';
                                    return (
                                        <ul><li><a href="/">{tblName}</a></li></ul>
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