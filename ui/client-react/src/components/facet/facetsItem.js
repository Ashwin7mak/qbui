import React from 'react';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './facet.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';

let logger = new Logger();

/**
 * FacetsItem one of the fields from the set of field facets groups
 * a Facets item has a field id, type, field name and a collection of facet values
 *
 *
 * in current stack each entry in facet array has :
 *      array of aspects(values)
 *      type of data (text, bool, or daterange), also field type
 *      has empty bool (if true include empty as a choice)
 *      fid number
 *      field name
 *      toomany to facet? bool
 *      reason = messageid for why no facets (too many values, other reasons?)
 **/


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
        fieldSelections: React.PropTypes.array,
        handleSelectValue: React.PropTypes.func,
        handleToggleCollapse: React.PropTypes.func
    },

    /**
     * function : getInitialState
     * initializes the set of selected values for this facet field to empty/one
     * @returns {{selectedValues: Array}}
     */
    getInitialState() {
        return {
            selectedValues: []
        };
    },
    getDefaultProps() {
        return {
            fieldSelections : []
        };
    },

    /**
     * function : renderFieldName
     * prepares the markup content of the facet field  name
     * @returns {XML}
     */
    renderFieldName() {
        var clearFacetsIcon = "";
        if (this.props.fieldSelections.length > 0) {
            clearFacetsIcon = (<QBicon className="clearFacet" icon="clear-mini"
                                       onClick={(e)=>this.props.handleClearFieldsSelects(this.props.facet)}/>);
        }
        //todo: render text values in small text
        var selectedValues = "";
        return (
                <h4 className="facetName" >
                    <span >{this.props.facet.name}</span>
                    {clearFacetsIcon}
                </h4>
            );
    },


    /**
     * function : renderValue
     * prepares the markup content of one of the facet field's values
     * @returns {XML}
     */
    renderValue(item, index) {
        var isSelected = _.indexOf(this.props.fieldSelections, item.value) !== -1;
        return (
            <ListGroupItem key={this.props.facet.fid + "." + index}
                           onClick={(e)=>this.props.handleSelectValue(e, this.props.facet, item.value)}
                           className={isSelected  ? "selected" : ""}>
                <QBicon className={isSelected  ? "checkMark-selected" : "checkMark"} icon="check" />
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
                   className={(this.props.fieldSelections.length > 0) ? "selections" : ""}
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

