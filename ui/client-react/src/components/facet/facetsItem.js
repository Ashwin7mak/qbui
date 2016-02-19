import React from 'react';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './facet.scss';
import  {facetShape} from './facetProps';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';


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
 *      too many to facet? bool
 *      reason = messageId for why no facets (too many values, other reasons?)
 **/

var FacetsItem = React.createClass({
    /**
     * this takes in as props
     *  - the facet field,
     *  -  a function to handle selection/deselection of one of the facet fields values used to initiate filter the report results
     *  - a function to handle the collapse/expansion of the facet field ;  hide or show its list of values
     */
    displayName: 'FacetsItem',
    propTypes: {
        facet:facetShape,
        fieldSelections: React.PropTypes.array,
        handleSelectValue: React.PropTypes.func,
        handleToggleCollapse: React.PropTypes.func,
        handleClearFieldSelects: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            fieldSelections : []
        };
    },

    clearSelects(e) {
        this.props.handleClearFieldSelects(this.props.facet);
        // prevent collapse of section just do the clear
        e.stopPropagation();
    },

    /**
     * function : renderFieldName
     * prepares the markup content of the facet field  name
     * @returns {XML}
     */
    renderFieldName() {
       // return <h3>{this.props.facet.name}</h3>;
        var clearFacetsIcon = "";
        var selectionInfo = "";
        var selectionStrings = "";
        if (this.props.fieldSelections.length > 0) {
            clearFacetsIcon = (<span onClick={this.clearSelects}>
                                    <QBicon className="clearFacet" icon="clear-mini" />
                                </span>);
            var listOfValues = _.map(this.props.facet.values, 'value');
            var originalOrderSelected =  _.intersection(listOfValues, this.props.fieldSelections);
            selectionStrings = (originalOrderSelected.map((item, index) => {
                return item + (index === (this.props.fieldSelections.length - 1) ? "" : ", ");
            }));
            selectionInfo = (<div className="selectionInfo small">{selectionStrings}</div>);
        }
        return (<div>
                    <h4 className="facetName" >
                        <span>{this.props.facet.name}</span>
                        {clearFacetsIcon}
                    </h4>
                    {selectionInfo}
                </div>
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

