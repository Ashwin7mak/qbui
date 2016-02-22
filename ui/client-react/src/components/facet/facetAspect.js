import React,  {Component}from 'react';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './facet.scss';
import  {facetItemValueShape, facetShape} from './facetProps';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import simpleStringify from '../../../../common/src/simpleStringify';

let logger = new Logger();


/**
 * FacetAspect a value from fields facets
 * a Facets aspect has a value, whether its selected flag, and parent facet field info, its index in the set
 **/
class FacetAspect extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'FacetAspect';
        this.propType = {
            isSelected: React.PropTypes.bool,
            facet: facetShape.isRequired,
            item: facetItemValueShape.isRequired,
            handleSelectValue: React.PropTypes.func
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        let answer = (nextProps.isSelected !== this.props.isSelected);
        if (answer) {
            logger.debug('FacetAspect shouldComponentUpdate isSelected changed' + this.props.facet.name + '/' + this.props.item.value + '\ncurrProps:' + simpleStringify(this.props) + ' \nnextProps:' + simpleStringify(nextProps));
            logger.debug('currState:' + simpleStringify(this.state) + ' \nnextState:' + simpleStringify(nextState));
            logger.debug('!=? ' + (nextProps !== this.props) + ' string!=? ' + (simpleStringify(nextProps) !== simpleStringify(this.props)));
            logger.debug('--\n\n');
        }

        return answer;
    }



    /**
     * function : render
     * prepares the markup content of one of the facet field's values
     * @returns {XML}
     */
    render() {
        return (
            <ListGroupItem
                           onClick={(e)=>this.props.handleSelectValue(e, this.props.facet, this.props.item.value)}
                           className={this.props.isSelected  ? "selected" : ""}>
                <QBicon className={this.props.isSelected  ? "checkMark-selected" : "checkMark"} icon="check" />
                {this.props.item.value}
            </ListGroupItem>
        );
    }

}
export default FacetAspect;
