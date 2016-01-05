import React from 'react';

import Logger from '../../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './filter.scss';
import {I18nMessage} from '../../../../src/utils/i18nMessage';
import ReportSearchBox from './filterSearchBox';
import Hicon from '../../harmonyIcon/harmonyIcon';

let FluxMixin = Fluxxor.FluxMixin(React);


var FacetsMenuButton = React.createClass({
    propTypes: {
        //TODO
    },

    render() {
        return (<div className="facetsMenuButton" >
                    {/* trigger when the icon is clicked on, not on the props.children */}
                    <div onClick={this.props.onClick}>
                        <Hicon icon="filter"  />
                    </div>
                    {this.props.children}
        </div>);
    }
});

export default FacetsMenuButton;
