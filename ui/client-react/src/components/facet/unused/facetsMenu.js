import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';
import {Dropdown, MenuItem, Panel, ListGroup, ListGroupItem} from 'react-bootstrap';

import './unused/callout.scss';
import './filter.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import FacetsItem from './FacetsItem';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

var FacetsMenu = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        //TODO
    },
    getInitialState: function() {
        return {
        };
    },

    selectHandler : function() {
    },

    /**
     * render a facet field item and its values
     **/
    facetsMenu: function() {
        return this.props.facetsData.list && this.props.facetsData.list.map((item, index) => {
            return <FacetsItem key={item.fid }
                               facet={item}
                               onSelect={this.props.onSelect}
                                {...this.props} />;
        });
    },

    render() {
        let facetsx = this.facetsMenu();
        let facets = (
            <div className="fa">
                <Panel fill collapsible defaultExpanded header="Panel heading">
                    <ListGroup fill>
                        <ListGroupItem>Item 1</ListGroupItem>
                        <ListGroupItem>Item 2</ListGroupItem>
                        <ListGroupItem>&hellip;</ListGroupItem>
                    </ListGroup>
                    Some more panel content here.
                </Panel>
                <Panel fill collapsible defaultExpanded header="Panel heading">
                    <ListGroup fill>
                        <ListGroupItem>Item 1</ListGroupItem>
                        <ListGroupItem>Item 2</ListGroupItem>
                        <ListGroupItem>&hellip;</ListGroupItem>
                    </ListGroup>
                    Some more panel content here.
                </Panel>
            </div>
            );
        return (
            <div className="clearfix open">

                    {/* handle the sublists of facets each (TODO: type dependent)*/}
                    {/*<div className="facets"> */}
                        {facets}
                    {/*</div>*/}

            </div>
        );
    }

});
export default FacetsMenu;
