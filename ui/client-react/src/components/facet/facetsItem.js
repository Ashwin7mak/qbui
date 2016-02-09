import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './facet.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

let logger = new Logger();

/**
 * FacetsItem one of the fields from the set of field facets groups
 * a Facets item has a field id, type, field name and a collection of facet values
 */


const facetItemValueShape = React.PropTypes.shape({
    value: React.PropTypes.string
});

const facetShape =  React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    type:React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(facetItemValueShape)
/*TODO support date type of facet field  */
});


var FacetsItem = React.createClass({
    /**
     * this takes in as props
     *  - the facet field,
     *  -  a function to handle selection/deselection of one of the facet fields values used to initiate filter the report results
     *  - a function to handle the collapse/expansion of the facet field ;  hide or show its list of values
     */
    propTypes: {
        facet:facetShape,
        handleSelectValue: React.PropTypes.func,
        handleToggleCollapse: React.PropTypes.func
    },

    /**
     * function : getInitialState
     * initializes the set of selected values for this facet field to empty/one
     * @returns {{selectedValues: Array}}
     */
    getInitialState: function() {
        return {
            selectedValues: []
        };
    },

    /**
     * function : renderFieldName
     * prepares the markup content of the facet field  name
     * @returns {XML}
     */
    renderFieldName() {
        return (
            <h4 className="facetName">{this.props.facet.name}</h4>
        );
    },


    /**
     * function : renderValue
     * prepares the markup content of one of the facet field's values
     * @returns {XML}
     */
    renderValue(item, index) {
        return (
            <ListGroupItem key={this.props.facet.fid + "." + index}
                           onClick={()=>this.props.handleSelectValue(this.props.facet, item.value)}>
                {item.value}
            </ListGroupItem>
        );
    },

    /**
     * function : renderValues
     * prepares the markup content of the set of facet field's values
     * @returns {XML}
     */
    renderValues() {
        /*TODO check type of facet list, string, date, boolean currently only handles string
         array values
         */
        return (
            this.props.facet.values && this.props.facet.values.map((item, index) => {
                return this.renderValue(item, index);
            })
        );
    },

    /**
     * function : render
     * prepares the markup content of the facet field group
     * @returns {XML}
     */
    render() {
        return (
            <Panel fill collapsible defaultExpanded {...this.props}
                   onSelect={this.props.handleToggleCollapse}
                   header={this.renderFieldName()}>
                <ListGroup fill>
                    {this.renderValues()}
                </ListGroup>
            </Panel>
        );
    }

});
export default FacetsItem;

