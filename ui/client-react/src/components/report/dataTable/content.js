import React from 'react';
import ReactIntl from 'react-intl';

import { Table } from 'react-bootstrap';

import '../../../assets/css/report.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return (this.props.data.length ?
            <Table style={{margin: '20px'}} striped bordered condensed hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>City</th>
                </tr>
                </thead>
                <tbody>
                {this.props.data.map((data) => {
                    return (
                        <tr>
                            <td >
                                {data.name}
                            </td>
                            <td >
                                {data.place}
                            </td>
                        </tr>)
                })}

                </tbody>
            </Table> : <div></div>
        )
    }
})

export default Content;