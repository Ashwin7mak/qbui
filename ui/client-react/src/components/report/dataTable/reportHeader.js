import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../../utils/i18nMessage';
import Locale from '../../../locales/locales';
import Fluxxor from 'fluxxor';
import Hicon from '../../harmonyIcon/harmonyIcon';

import './reportHeader.scss';

import {Glyphicon, Input} from 'react-bootstrap';

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

        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={"tableBar"}>

                <div>
                    <div className="searchInput">
                        <Input bsClass="search" size="30" className="searchInputBox" standalone addonBefore={searchIcon} type="text" placeholder="Search Records"  onChange={this.searchChanged} />
                    </div>
                    <a><Hicon icon="filter"/></a>
                </div>
            </div>
        );
    }
});

export default ReportHeader;
