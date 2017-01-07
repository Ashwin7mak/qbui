import React,  {Component} from 'react';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './facet.scss';
import  {facetItemValueShape, facetShape} from './facetProps';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import simpleStringify from '../../../../common/src/simpleStringify';
import _ from 'lodash';
let logger = new Logger();


/**
 * FacetsAspect a value from fields facets
 * a Facets aspect has a value, whether its selected flag, and parent facet field info, its index in the set
 **/
class FacetsAspect extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'FacetsAspect';
        this.propType = {
            isSelected: React.PropTypes.bool,
            facet: facetShape.isRequired,
            item: facetItemValueShape.isRequired,
            handleSelectValue: React.PropTypes.func
        };
    }

    shouldComponentUpdate(nextProps) {
        let answer = (nextProps.isSelected !== this.props.isSelected);
        return answer;
    }



    /**
     * function : render
     * prepares the markup content of one of the facet field's values
     * @returns {XML}
     */
    render() {
        let itemValue =  this.props.item ? this.props.item.value : null;
        itemValue = _.unescape(itemValue);
        return (
            <ListGroupItem
                           onClick={(e)=>this.props.handleSelectValue(e, this.props.facet, itemValue)}
                           className={this.props.isSelected  ? "selected" : ""}>
                <span className="list-group-item-inner-wrapper">
                    <QBicon className={this.props.isSelected  ? "checkMark-selected" : "checkMark"} icon="check" />
                    {itemValue}
                </span>
            </ListGroupItem>
        );
    }

}
export default FacetsAspect;
