import React from 'react';
import ReactIntl from 'react-intl';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return ( this.props.data.apps.length ?
            <div>
                {this.props.data.apps.map((app) => {
                    let hdr = app.name + ' (' + app.id + ')'
                    return (
                        <ListGroup>
                            <ListGroupItem header={hdr}>
                                {app.tables.map((table) => {
                                    let tbl = table.name + ' (' + table.id + ')';
                                    return (<a href="/">{tbl}</a>);
                                })}
                            </ListGroupItem>
                        </ListGroup>
                    );
                })}
            </div> : <div>No apps found</div>
        )
    }
});

export default Content;