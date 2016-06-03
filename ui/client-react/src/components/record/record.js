import React from 'react';

import './record.scss';

import QBForm from './../QBForm/qbform.js';

let Record = React.createClass({

    render: function() {
        return (
            <QBForm formData={this.props.formData}></QBForm>
        );
    }
});

export default Record;
