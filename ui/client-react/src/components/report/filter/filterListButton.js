import React from 'react';

import Logger from '../../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './filter.scss';
import {I18nMessage} from '../../../../src/utils/i18nMessage';
import ReportSearchBox from './filterSearchBox';
import Hicon from '../../harmonyIcon/harmonyIcon';

let FluxMixin = Fluxxor.FluxMixin(React);


var FilterListButton = React.createClass({
    render() {
        return (<div className="filterListButton" >
                    {/* trigger when the icon is clicked on, not the props.children */}
                    <div onClick={this.props.onClick}>
                        <Hicon icon="filter"  />
                    </div>
                    {this.props.children}
        </div>);
    }
});

export default FilterListButton;
