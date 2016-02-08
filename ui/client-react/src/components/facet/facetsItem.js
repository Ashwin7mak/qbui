import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './facet.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

let logger = new Logger();

/*TODO support type of facet date
 */
const facetItemValueShape = React.PropTypes.shape({
    value: React.PropTypes.string
});

const facetShape =  React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    type:React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(facetItemValueShape)
});

var FacetsItem = React.createClass({
    propTypes: {
        facet:facetShape,
        handleSelectValue: React.PropTypes.func,
        handleToggleCollapse: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            selectedValues: []
        };
    },
    renderFieldName() {
        return (
            <span className="facetName">{this.props.facet.name}</span>
        );
    },
    /*TODO check type of facet list, date, boolean currently only handles
     array values
     */
    renderValues() {
        return (
            this.props.facet.values && this.props.facet.values.map((item, index) => {
                return (
                    <ListGroupItem key={this.props.facet.fid + "." + index}
                              onClick={()=>this.props.handleSelectValue(this.props.facet, item.value)}>
                        {item.value}
                    </ListGroupItem>
                );
            })
        );
    },

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

