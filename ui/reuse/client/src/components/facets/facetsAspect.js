import React,  {PropTypes, Component} from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import  {facetItemValueShape, facetShape} from './facetProps';
import Icon from '../icon/icon';
import _ from 'lodash';

import './facet.scss';

/**
 * FacetsAspect a value from fields facets
 * a Facets aspect has a value, whether its selected flag, and parent facet field info, its index in the set
 **/
class FacetsAspect extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'FacetsAspect';
    }

    shouldComponentUpdate = (nextProps) => {
        let answer = (nextProps.isSelected !== this.props.isSelected);
        return answer;
    }

    getFacetValue = () => {
        let itemValue =  this.props.item ? this.props.item.value : null;
        return _.unescape(itemValue);
    }

    onClickFacetValue = (e) => {
        if (this.props.handleSelectValue) {
            this.props.handleSelectValue(this.props.facet, this.getFacetValue(), e);
        }
    }

    /**
     * function : render
     * prepares the markup content of one of the facet field's values
     * @returns {XML}
     */
    render() {
        return (
            <ListGroupItem onClick={this.onClickFacetValue}
                           className={this.props.isSelected  ? "selected" : ""}>
                <span className="list-group-item-inner-wrapper">
                    <Icon className={this.props.isSelected  ? "checkMark-selected" : "checkMark"} icon="check" />
                    {this.getFacetValue()}
                </span>
            </ListGroupItem>
        );
    }
}

FacetsAspect.propType = {
    /*
    * Set to false as default and set to true only when toggled */
    isSelected: React.PropTypes.bool,
    /*
    * Prop for the facet */
    facet: facetShape.isRequired,
    item: facetItemValueShape.isRequired,
    /*
    * Function that handles a selected value */
    handleSelectValue: React.PropTypes.func
};

export default FacetsAspect;
