import React from 'react';

import './record.scss';

import QBForm from './../QBForm/qbform.js';

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
