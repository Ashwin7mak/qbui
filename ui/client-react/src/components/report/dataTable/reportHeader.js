import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../../utils/i18nMessage';
import Locale from '../../../locales/locales';
import Fluxxor from 'fluxxor';
import QBicon from '../../qbIcon/qbIcon';

import './reportHeader.scss';

import {Input} from 'react-bootstrap';

let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * a header for table reports with search field and a filter icon
 */
var ReportHeader = React.createClass({
    mixins: [FluxMixin],

    searchChanged(ev) {
        const text = ev.target.value;
        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },

    render() {

        return (
            <div className={"tableBar"}>

                <div>
                    <div className="searchInput">
                        <Input bsClass="search" size="20" className="searchInputBox" standalone type="text" placeholder="Search Records"  onChange={this.searchChanged} />
                    </div>
                    <a><QBicon icon="filter-tool"/></a>
                </div>
            </div>
        );
    }
});

export default ReportHeader;
