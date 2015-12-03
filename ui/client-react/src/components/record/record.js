import React from 'react';

import './record.scss';

import QBForm from './../qbForm/qbform.js';

import './rc-tabs.scss';

let Record = React.createClass({

    render: function() {
        return (
            <div>
                <QBForm></QBForm>
            </div>
        );
    }
});

export default Record;
