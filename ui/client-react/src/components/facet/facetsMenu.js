import React from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';
import * as breakpoints from '../../constants/breakpoints';

import QBicon from '../qbIcon/qbIcon';
import FacetsList from './facetsList';
import LimitConstants from './../../../../common/src/limitConstants';
import './facet.scss';
import _ from 'lodash';

let logger = new Logger();

/**
 *  FacetsMenu component presents a trigger button that when clicked shows list of facets available to filter a report on.
 *  When the list is shown and the trigger button is clicked again it hides the FacetMenu.
 *
 *  For each field with facet values there is collapsible field header and the list of facetItems
 *
 *  The FacetsMenu has a trigger button and the FacetsList
**/
var FacetsMenu = React.createClass({
    displayName: 'FacetsMenu',
    contextTypes: {
        breakpoint: React.PropTypes.string,
        touch: React.PropTypes.bool
    },
    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of facets
         *  and a function to call when a facet value is selected.
         **/
        reportData: React.PropTypes.shape({
            data: React.PropTypes.shape({
                facets:  React.PropTypes.shape({
                    list: React.PropTypes.array.isRequired
                })
            })
        }),
        onFacetSelect : React.PropTypes.func,
        maxInitRevealed: React.PropTypes.number,
    },

    /**
     * Initializes the states:
     *  - (shown)  : Facet List popover shown state or not shown
     *  - (expandedFacetFields) : the facet fields sections in the
     *                          popover that are expanded (initialized using the allInitiallyCollapsed prop setting)
     *  - (selected): set of selected facet values
     *
     * @returns {{expandedFacetFields: Array, selected: Array}}
     */
    getInitialState() {

        //TODO: move these to use fluxxor actions and stores to make the sticky across views.
        let expanded = [];
        let moreRevealed = [];

        if (!this.props.allInitiallyCollapsed) {

           // if we don't start with all collapsed then
            // add all facet fids to list of expanded facet fields
            if (this.props.reportData.data && this.props.reportData.data.facets && this.props.reportData.data.facets.list) {
                _.each(this.props.reportData.data.facets.list, function(facet) {
                    expanded.push(facet.id);
                });
            }
        }
        return {
            expandedFacetFields: expanded,
            moreRevealedFacetFields : moreRevealed
        };
    },

    /**
     * Specifies what to use for the default collapse/expand mode to use for all the fields facets
     *
     * @returns {{allInitiallyCollapsed: boolean}}
     */
    getDefaultProps() {
        return {
            allInitiallyCollapsed : true,
            maxInitRevealed : LimitConstants.maxFacetValuesInitiallyRevealed
        };
    },


    /**
     * Changes of the state of the facet popover to hidden or shown
     *
     * @param e
     */
    toggleMenu(e) {
        this.setState({target: e.target, show: !this.state.show});
    },


    /**
     * Changes the state of a facet field group to collapsed if parameter makeCollapsed is true or expanded if not
     * by adding or removing the field id from a hash listing the expanded facet field groups
     *
     * @param facetField - the facet
     * @param makeCollapsed
     *
     **/
    setFacetCollapsedState(facetField, makeCollapsed) {
        let expanded = _.clone(this.state.expandedFacetFields);
        if (makeCollapsed) {
            //in expanded set?  remove to mark it collapsed
            if (_.includes(expanded, facetField.id)) {
                _.pull(expanded, facetField.id);
            }
        } else {
            // add it to toggle from collapsed state
            expanded.push(facetField.id);
        }
        this.setState({expandedFacetFields: expanded});
    },

    /**
     * Changes the state of a facet field group to more revealed
     * by adding the field id from a hash listing the more Revealed facet field groups
     *
     * @param facetField - the facet
     * @param makeCollapsed
     *
     **/
    setFacetMoreRevealedState(facetField) {
        let revealed = _.clone(this.state.moreRevealedFacetFields);
        // add it
        revealed.push(facetField.id);
        this.setState({moreRevealedFacetFields: revealed});
    },

    /**
     * Check if a facet field group section is collapsed or not
     *
     * @param id - the id of field to check
     * @returns {boolean} returns true if it's collapsed
     **/
    isCollapsed(id) {
        return (!_.includes(this.state.expandedFacetFields, id));
    },

    /**
     * Check if a facet field group section has more revealed or not
     *
     * @param id - the id of field to check
     * @returns {boolean} returns true if it's revealed
     **/
    isRevealed(id) {
        return (_.includes(this.state.moreRevealedFacetFields, id));
    },

    /**
     * Toggle the fate of expand Collapse of a facet field group in the popover
     * change state of a facet from expanded to collapsed or collapsed to expanded
     * @param facetField - the fact field you want to toggle
     **/
    toggleCollapseFacet(facetField) {
        this.setFacetCollapsedState(facetField, !this.isCollapsed(facetField.id));
    },

    /**
     * Se the fate of more values revealed for a large facet field group in the popover
     * change state of a facet to more revealed
     * @param facetField - the fact field you want to reveal all the values for
     **/
    setRevealMore(facetField) {
        this.setFacetMoreRevealedState(facetField);
    },

    /**
     * Handle the ui event that occurred - handled changing the collapse/expand state of a
     * facet field group. To make the facet field groups values hidden or shown.
     *
     * @param e - the event object from the browser/react
     * @param facetField - the facet field group to act on
     **/
    handleToggleCollapse(e, facetField) {
        //logger.debug("got toggle collapse on field id " + facetField.id);
        this.toggleCollapseFacet(facetField);
    },

    /**
     * Handle the ui event that occurred - handled changing the show more state of a
     * facet field group. To make the remainder of facet field groups values shown.
     *
     * @param e - the event object from the browser/react
     * @param facetField - the facet field group to act on
     **/
    handleRevealMore(e, facetField) {
        this.setRevealMore(facetField);
    },

    /**
     * Don't handle other listeners i.e. avoid closing facet window on this event
     * rootClose will close any click out side popover
     * (we want to keep open on facet selections clicks)
     * @param e
     */
    dontClose(e) {
        // prevent close of popover just do the clear
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    },

    /**
     * Clear the selected value,
     * @param e
     * @param facet
     * @param value
     */
    clearSelect(e, facet, value) {
        if (e.target.classList.contains('clearFacet')) {
            this.props.onFacetDeselect(e, facet, value);
        }
        this.dontClose(e);
    },

    /**
     * render the selected facet value tokenized
     * @returns {null}
     */
    renderSelectedFacets() {
        let selections = this.props.selectedValues;
        if (!selections || !selections.hasAnySelections()) {
            return null;
        }
        let components = [];
        let self = this;
        this.props.reportData.data.facets.list.map((facet) => {
            if (selections.hasAnySelectionsForField(facet.id)) {
                let kids = (selections.getFieldSelections(facet.id).map((value) => {
                    return (<span key={'token.' + facet.name + '.' + value}
                                  className="selectedToken">
                                 <span className="selectedTokenName"  onClick={(e) => self.clearSelect(e, facet, value)}>
                                      {value}
                                    <QBicon className="clearFacet" icon="clear-mini"/>
                                 </span>

                          </span>);
                }));
                components.push(<div className="facetToken" key={'token' + facet.name} ><span className="facetNameToken">{facet.name}</span>
                    <span className="facetSelections">{kids}</span></div>);
            }
        });
        return components;
    },

    /**
     * Prepares the facet menu button used to show/hide the popover menu of field facet groups when clicked
     *
     **/
    render() {
        let menuKey =  this.props.appId + "." +  this.props.tblId + "." +  this.props.rptId;
        return (
            <div className="facetsMenuContainer">
            <div>
                {/* list of facet options shown when filter icon clicked */}
                <OverlayTrigger container={this} trigger="click" placement="bottom"
                                ref="facetOverlayTrigger" rootClose={true}
                                show={this.state.show}
                                target={()=> document.getElementById('facetsMenuTarget')}
                                onHide={() => this.setState({show: false})}
                                overlay={
                                    <FacetsList
                                        key= {"FacetsList." + menuKey}
                                        popoverId={menuKey}
                                        isCollapsed={this.isCollapsed}
                                        handleToggleCollapse={this.handleToggleCollapse}
                                        isRevealed={this.isRevealed}
                                        handleRevealMore={this.handleRevealMore}
                                        maxInitRevealed={this.props.maxInitRevealed}
                                        menuButton={this.refs.facetsMenuButton}
                                        expandedFacetFields={this.state.expandedFacetFields}
                                        moreRevealedFacetFields={this.state.moreRevealedFacetFields}
                                        onFacetClearFieldSelects={this.props.onFacetClearFieldSelects}
                                        selectedValues={this.props.selectedValues}
                                        reportData={this.props.reportData}
                                        onFacetSelect={this.props.onFacetSelect}
                                        onFacetDeselect={this.props.onFacetDeselect}
                                    />}>

                    {/* the filter icon button */}
                    <div className={"facetsMenuButton " +  (this.state.show ? "popoverShown" : "")}
                         ref="facetsMenuButton"
                         >
                        <span className="facetButtons" onClick={e => this.toggleMenu(e)}>
                            <QBicon className="filterButton" icon={(this.props.selectedValues &&
                                                    this.props.selectedValues.hasAnySelections()) ?
                                        "filter-status" : "filter-tool"} />
                            <QBicon className="filterButtonCaret" icon="caret-filled-down" />
                        </span>
                    </div>
                </OverlayTrigger>
                {((this.context.breakpoint !== breakpoints.SMALL_BREAKPOINT) &&
                   !this.context.touch) &&
                <div className="selectedFacets" onClick={e => this.dontClose(e)}>{this.renderSelectedFacets()}</div>
                }
            </div>

            </div>
        );
    }
});

export default FacetsMenu;
