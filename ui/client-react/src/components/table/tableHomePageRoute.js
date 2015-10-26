import React from 'react';
//import ReactIntl from 'react-intl';
//import ReactBootstrap from 'react-bootstrap';
//import { Locale, getI18nBundle } from '../../locales/locales';

//import Logger from '../../utils/logger';
//let logger = new Logger();

import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);
//let i18n = getI18nBundle();

let TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],


    render: function() {

        return (<div>
            <div>Table Homepage goes here... {this.props.mobile ? '(mobile version)' : '(desktop version)'}</div>
        </div>);
    }
});

export default TableHomePageRoute;
