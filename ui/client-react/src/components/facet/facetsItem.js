import React from 'react';
import Fluxxor from 'fluxxor';
import Promise from 'bluebird';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './unused/callout.scss';
import './facet.scss';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);
let logger = new Logger();

/*TODO support type of facet date
 */
const facetItemValueShape = React.PropTypes.shape({
    value: React.PropTypes.string
});

const facetShape =  React.PropTypes.shape({
    fid: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(facetItemValueShape)
});

var FacetsItem = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        facet:facetShape,
        selectValueHandler: React.PropTypes.func,
    },

    getInitialState: function() {
        return {
            selectedValues: []
        };
    },
    /*TODO check type of facet list, date, boolean currently only handles
     array values
     */
    renderValues() {
        return (
            this.props.facet.values && this.props.facet.values.map((item, index) => {
                return (
                    <ListGroupItem key={this.props.facet.fid + "." + index}
                              onSelect={this.props.selectValueHandler}>
                        {item.value}
                    </ListGroupItem>
                );
            })
        );
    },
    renderFieldName() {
        return (
            <span className="facetName">{this.props.facet.name}</span>
        );
    },
    render() {
        return (
            <Panel fill collapsible defaultExpanded key={this.props.facet.fid} header={this.renderFieldName()}>
                <ListGroup fill>
                    {this.renderValues()}
                </ListGroup>
            </Panel>
        );
    }

});
export default FacetsItem;

