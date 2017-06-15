import React, {Component, PropTypes} from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import Panel from 'react-bootstrap/lib/Panel';
import FacetsAspect from './facetsAspect';
import {I18nMessage} from '../../utils/i18nMessage';
import Icon from '../icon/icon';
import Tooltip from '../tooltip/tooltip';
import './facet.scss';

//IMPORTS FROM CLIENT-REACT
import * as schemaConsts from '../../../../../client-react/src/constants/schema.js';
//IMPORTS FROM CLIENT-REACT

/**
 * NOTE: Most likely, you want to use the `GenericFacetMenu`. Check out that component first before using this one.
 *       GenericFacetMenu is the parent component that renders GenericFacetList and which inturn renders GenericFacetItem.
 *
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
class GenericFacetItem extends Component {
    /**
     * this takes in as props
     *  - the facet field,
     *  -  a function to handle selection/deselection of one of the facet fields values used to initiate filter the report results
     *  - a function to handle the collapse/expansion of the facet field ;  hide or show its list of values
     */

    shouldComponentUpdate(nextProps) {
        let answer = false;

        if (nextProps.isExpanded !== this.props.isExpanded) {
            answer = true;
        }

        if (!_.isEqual(nextProps.selectedFacetValues, this.props.selectedFacetValues)) {
            answer = true;
        }

        return answer;
    }

    normalizeValue = (aFacet, val) => {
        let YesMsg = 'report.facets.yesCheck';
        let NoMsg = 'report.facets.noCheck';

        //convert false/true to i18n version of boolean value
        if (aFacet.type && aFacet.type.toUpperCase() === schemaConsts.CHECKBOX) {
            let chkbxVal = val ? val : '';
            if (!chkbxVal || chkbxVal === '' || chkbxVal === 0 ||
                chkbxVal.toString().toUpperCase() === 'NO' ||
                chkbxVal.toString().toUpperCase() === 'FALSE') {
                // when react 18n supports plain string (non dom wrapped)
                // xtlate use the message keys above
                val = 'No';
            } else {
                val = 'Yes';
            }
        } else {
            val = val ? val : '';
        }
        return val;
    }

    /**
     * function : renderValues
     * prepares the markup content of the set of facet field's values
     * @returns {XML}
     */
    renderValues = () => {
        return this.props.facet.values.map((facetValue, index) => {
            let normalizedValue = {
                ...facetValue,
                value: this.normalizeValue(this.props.facet, facetValue.value)
            };
            return this.renderValue(normalizedValue, index);
        });
    }

    /**
     * Clears the selected facets
     */
    clearSelects = (e) => {
        if (this.props.onClickClearFacetValues) {
            this.props.onClickClearFacetValues(this.props.facet);
        }

        // prevent collapse of section just do the clear
        if (e.nativeEvent.stopPropagation && typeof e.nativeEvent.stopPropagation  === 'function') {
            e.nativeEvent.stopPropagation();
        }
        if (e.nativeEvent.stopImmediatePropagation && typeof e.nativeEvent.stopImmediatePropagation  === 'function') {
            e.nativeEvent.stopImmediatePropagation();
        }
    }

    /**
     * function : renderFieldName
     * prepares the markup content of the facet field  name
     * @returns {XML}
     */
    renderFieldName = () => {
        let facetName = this.props.facet.name;
        let clearFacetsIcon = "";
        let selectionInfo = "";
        let selectionStrings = "";
        if (this.props.selectedFacetValues.length > 0) {
            // note onMouseDown instead of onClick necessary here to support rootClose on the menu
            // so that it will not propagate to thru to parent collapse while clearing selection
            clearFacetsIcon = (
                <span className="clearFacetContainer">
                    <Tooltip tipId="clearFacet" i18nMessageKey="report.facets.clearFacet" facet={facetName}>
                        <span className="clearSelectedFacetsButton" onTouchStart={this.clearSelects} onMouseDown={this.clearSelects}>
                            <Icon className="clearFacet" icon="clear-mini" />
                        </span>
                    </Tooltip>
                </span>
            );
            let listOfValues = this.props.facet.values.map(x => x.value);
            //TODO: ID MAPPING
            let originalOrderSelected =  _.intersection(listOfValues, this.props.selectedFacetValues);
            selectionStrings = (originalOrderSelected.map((item, index) => {
                return item + (index === (this.props.selectedFacetValues.length - 1) ? "" : ", ");
            }));
            selectionInfo = (<div className="selectionInfo small">{selectionStrings}</div>);
        }

        let actionable = null;
        let tooManyValues = 'report.facets.tooManyValues';
        let subtitle = null;
        if (this.props.facet.values.length === 0) {
            subtitle =  (<div className="noOptions small"><I18nMessage message={tooManyValues}/></div>);
            actionable = "notActionable";
        }
        return (<div>
                <h4 className={"facetName " + actionable} >
                    <span>{facetName}</span>
                    {subtitle}
                    {clearFacetsIcon}
                </h4>
                {selectionInfo}
            </div>
        );
    }

    /**
     *  Displays the extra set of facets pertaining the set limit
     */
    onClickShowMore = (e) => {
        if (this.props.onClickShowMore) {
            this.props.onClickShowMore(this.props.facet, e);
        }
    }

    /**
     * function : renderValue
     * prepares the markup content of one of the facet field's values
     * @returns {XML}
     */
    renderValue(item, index) {
        let isSelected = this.props.selectedFacetValues.indexOf(item.value) !== -1;
        return (
            <FacetsAspect isSelected={isSelected}
                          item={item}
                          index={index}
                          key={this.props.popoverId + "." + this.props.facet.id + "." + index}
                          facet={this.props.facet}
                          handleSelectValue={this.props.onClickFacetValue}
            />
        );
    }

    /**
     *  Selects the facet which shows the different facet values for the selected facet
     */
    onClickFacet = (e) => {
        if (this.props.onClickFacet) {
            return this.props.onClickFacet(this.props.facet, this.props.isExpanded, e);
        }
    }

    /**
     * function : render
     * prepares the markup content of the facet field group
     * @returns {XML}
     */
    render() {
        let seeMore = "report.facets.seeMore";
        return (
            <Panel fill collapsible defaultExpanded expanded={this.props.isExpanded} {...this.props}
                   key = {"panel." + this.props.popoverId + "." + this.props.facet.id}
                   className={(this.props.selectedFacetValues.length > 0) ? "selections" : ""}
                   onSelect={this.onClickFacet}
                   header={this.renderFieldName()}>

                { // get values rendered only if its not expanded
                    this.props.isExpanded &&
                        (<ListGroup fill>
                            {this.renderValues()}
                            {this.props.facet.hasMore &&
                                <span className="listMore list-group-item" onClick={this.onClickShowMore}>
                                    <I18nMessage message={seeMore} /></span>}
                        </ListGroup>)
                }
            </Panel>
        );
    }
}

GenericFacetItem.propTypes = {
    /**
     *  ID of the facet that is selected
     */
    popoverId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     *  Array containing the selected facet values
     */
    selectedFacetValues: PropTypes.array,
    /**
     *  Function that shows the facet values when a facet is clicked
     */
    onClickFacet: PropTypes.func,
    /**
     *  Handles what needs to happen when a facet value is clicked
     */
    onClickFacetValue: PropTypes.func,
    /**
     *  Clears the selected facet values when clicked
     */
    onClickClearFacetValues: PropTypes.func,
    /**
     * The data which is being passed to be filtered
     */
    facet: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        hasMore: PropTypes.bool,
        values: PropTypes.array(PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        })),
    }),
    /**
     *  Checks whether the facet values has an expanded set consisting of more facets
     */
    isExpanded: PropTypes.bool,
};

GenericFacetItem.defaultProps = {
    /**
     *  Has the selected facet values in an array
     *  Currently set to an empty array since no facets are selected
     */
    selectedFacetValues : [],
};

export default GenericFacetItem;
