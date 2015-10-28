import React from 'react';

import './mobileSearchBar.scss';
import Fluxxor from 'fluxxor';
import {Glyphicon, DropdownButton, MenuItem, Input, Button} from 'react-bootstrap';

let FluxMixin = Fluxxor.FluxMixin(React);

//const debounceSearchMillis = 100;

var MobileSearchBar = React.createClass({
    mixins: [FluxMixin],

    searchChanged: function(ev) {
        let flux = this.getFlux();
        flux.actions.searchFor(ev.target.value);
    },
    onFocus: function() {
        let flux = this.getFlux();
        flux.actions.setSearching(true);
    },
    onBlur: function() {
        let flux = this.getFlux();

        // react seems to lose the cancel onclick after re-rendering due to onBlur so give it a chance to fire
        window.setTimeout(() => {
            flux.actions.setSearching(false);
        }, 500);
    },
    cancelSearch: function() {
        let flux = this.getFlux();
        let input = this.input.getInputDOMNode();
        input.value = "";
        flux.actions.searchFor(input.value);
        flux.actions.setSearching(false);
    },
    render: function() {
        const searchIcon = <Glyphicon glyph="search"/>;

        return (
            <div key={'searchBar'} className={'searchBar'}>
                <div className={'searchLine'}>
                    <Input key={'searchInput'} ref={(ref)=>this.input = ref} onBlur={this.onBlur} onFocus={this.onFocus}
                           standalone type="text" placeholder="Search Records" addonBefore={searchIcon}
                           onChange={this.searchChanged}/>
                    {this.props.searching &&
                        <Button bsStyle={'link'} className={'cancel'} onClick={this.cancelSearch}>Cancel</Button> }
                </div>
                <div className={'filterLine'}>
                    <DropdownButton bsStyle={'link'} title={'Filter by'} id={'searchDropDown'}>
                        <MenuItem>todo...</MenuItem>
                    </DropdownButton>
                </div>
            </div>
        );
    }
});

export default MobileSearchBar;
