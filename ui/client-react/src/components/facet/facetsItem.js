import React,  {Component}from 'react';
import {Dropdown, MenuItem, ListGroup, Panel, ListGroupItem} from 'react-bootstrap';
import QBPanel from '../QBPanel/qbpanel.js';

import './facet.scss';
import  {facetShape} from './facetProps';
import  FacetsAspect from './facetsAspect';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import simpleStringify from '../../../../common/src/simpleStringify';

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
 *      too many to facet? bool
 *      reason = messageId for why no facets (too many values, other reasons?)
 **/
class FacetsItem extends Component {
    /**
     * this takes in as props
     *  - the facet field,
     *  -  a function to handle selection/deselection of one of the facet fields values used to initiate filter the report results
     *  - a function to handle the collapse/expansion of the facet field ;  hide or show its list of values
     */
    constructor(props) {
        super(props);
        this.displayName = 'FacetsItem';
        this.propType = {
            facet: facetShape.isRequired,
            popoverId : React.PropTypes.string,
            maxInitRevealed : React.PropTypes.number,
            isRevealed : React.PropTypes.bool,
            expanded :  React.PropTypes.bool,
            fieldSelections: React.PropTypes.array,
            handleSelectValue: React.PropTypes.func,
            handleToggleCollapse: React.PropTypes.func,
            handleClearFieldSelects: React.PropTypes.func
        };
    }

    clearSelects(e) {
        this.props.handleClearFieldSelects(this.props.facet);
        // prevent collapse of section just do the clear
        e.stopPropagation();
        if (e.nativeEvent.stopImmediatePropagation && typeof e.nativeEvent.stopImmediatePropagation  === 'function') {
            e.nativeEvent.stopImmediatePropagation();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let answer = false;

        if (nextProps.expanded !== this.props.expanded) {
            answer = true;
        }

        if (!_.isEqual(nextProps.fieldSelections, this.props.fieldSelections)) {
            answer = true;
        }

        if (nextProps.isRevealed !== this.props.isRevealed) {
            answer = true;
        }

        return answer;
    }

    /**
     * function : renderFieldName
     * prepares the markup content of the facet field  name
     * @returns {XML}
     */
    renderFieldName() {
        var clearFacetsIcon = "";
        var selectionInfo = "";
        var selectionStrings = "";
        if (this.props.fieldSelections.length > 0) {
            // note onMouseDown instead of onClick necessary here to support rootClose on the menu
            // so that it will not propagate to thru to parent collapse while clearing selection
            clearFacetsIcon = (<span onMouseDown={e => this.clearSelects(e)} >
                                    <QBicon className="clearFacet" icon="clear-mini" />
                                </span>);
            var listOfValues = this.props.facet.values.map(x => x.value);
            var originalOrderSelected =  _.intersection(listOfValues, this.props.fieldSelections);
            selectionStrings = (originalOrderSelected.map((item, index) => {
                return item + (index === (this.props.fieldSelections.length - 1) ? "" : ", ");
            }));
            selectionInfo = (<div className="selectionInfo small">{selectionStrings}</div>);
        }

        let actionable = null;
        let tooManyValues = 'report.facets.tooManyValues';
        let subtitle = null;
        if ((!this.props.facet.values || this.props.facet.values.length === 0)) {
            subtitle =  (<div className="noOptions small"><I18nMessage message={tooManyValues}/></div>);
            actionable = "notActionable";
        }
        return (<div>
                    <h4 className={"facetName " + actionable} >
                        <span>{this.props.facet.name}</span>
                        {subtitle}
                        {clearFacetsIcon}
                    </h4>
                    {selectionInfo}
                </div>
            );
    }


    /**
     * function : renderValue
     * prepares the markup content of one of the facet field's values
     * @returns {XML}
     */
    renderValue(item, index) {
        var isSelected = this.props.fieldSelections.indexOf(item.value) !== -1;
        return (
            <FacetsAspect isSelected={isSelected}
                         item={item}
                         index={index}
                         key={this.props.popoverId + "." + this.props.facet.id + "." + index}
                         facet={this.props.facet}
                         handleSelectValue={this.props.handleSelectValue}
            />
        );
    }

    /**
     * function : renderValues
     * prepares the markup content of the set of facet field's values
     * @returns {XML}
     */
    renderValues() {
        /*TODO check type of facet list, string, date, boolean currently only handles string
         array values
         */
        if ((!this.props.facet.values || this.props.facet.values.length === 0)) {
            return null;
        }

        let listToShow = this.props.facet.values;

        // if there are a lot of values just show max and see more
        if ((this.props.facet.values.length > this.props.maxInitRevealed) &&  !this.props.isRevealed) {
            listToShow = _.take(this.props.facet.values, this.props.maxInitRevealed);
        }

        return (
            listToShow.map((item, index) => {
                return this.renderValue(item, index);
            }
            )
        );
    }

    /**
     * function : render
     * prepares the markup content of the facet field group
     * @returns {XML}
     */
    render() {
        let seeMore = "report.facets.seeMore";

        return (
            <Panel fill collapsible defaultExpanded {...this.props}
                   key = {"panel." + this.props.popoverId + "." + this.props.facet.id}
                   className={(this.props.fieldSelections.length > 0) ? "selections" : ""}
                   onSelect={this.props.handleToggleCollapse}
                   header={this.renderFieldName()}>

                    { // get values rendered only if its not expanded
                    this.props.expanded ?
                        (<ListGroup fill>
                            {this.renderValues()}
                            {(this.props.facet.values.length > this.props.maxInitRevealed &&  !this.props.isRevealed ?
                                (<span className="listMore" onClick={(e) => this.props.handleRevealMore(e, this.props.facet)}>
                                    <I18nMessage message={seeMore} /></span>) : null)}
                        </ListGroup>) :
                        null
                    }

            </Panel>
        );
    }
}
FacetsItem.defaultProps = {
    fieldSelections : [],
    isRevealed: true,
    maxInitRevealed : 10,
    expanded : false
};

export default FacetsItem;

