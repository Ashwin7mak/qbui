import React from 'react';
import ReactIntl from 'react-intl';
import {I18nMessage, I18nDate} from '../../../utils/i18nMessage';
import Locale from '../../../locales/locales';
import Fluxxor from 'fluxxor';
import Hicon from '../../harmonyIcon/harmonyIcon';

import './reportActions.scss';

import {MenuItem, Dropdown, ButtonGroup, Button, OverlayTrigger, Popover, Glyphicon, Input} from 'react-bootstrap';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportActions = React.createClass({
    mixins: [FluxMixin],
    searchChanged(ev) {
        const text = ev.target.value;
        let flux = this.getFlux();
        flux.actions.searchFor(text);
    },
    render() {

        const searchIcon = <Glyphicon glyph="search" />;

        return (
            <div className={'reportActions'}>

                <div>
                {this.props.selection.length ?
                    <ButtonGroup>
                        <Button>View</Button>
                        <Button>Delete</Button>
                        <Button>Edit</Button>

                    </ButtonGroup> :
                    ''}
                    <div className="searchInput">
                        <Input bsClass="search" size="30" className="searchInputBox" standalone addonBefore={searchIcon} type="text" placeholder="Search Records"  onChange={this.searchChanged} />
                    </div>
                </div>
                <span className="selectedRowsLabel">{(this.props.selection.length ? this.props.selection.length : "No")} rows selected </span>
            </div>
        );
    }
});

export default ReportActions;
