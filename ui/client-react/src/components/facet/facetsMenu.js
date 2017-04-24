import React from 'react';
import {Overlay} from 'react-bootstrap';

import Logger from '../../utils/logger';

import QBicon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
import  {facetsProp} from './facetProps';
import FacetsList from './facetsList';
import LimitConstants from './../../../../common/src/limitConstants';
import './facet.scss';

import _ from 'lodash';
import Fluxxor from 'fluxxor';

let logger = new Logger();
let FluxMixin = Fluxxor.FluxMixin(React);
let StoreWatchMixin = Fluxxor.StoreWatchMixin;

/**
 *  FacetsMenu component presents a trigger button that when clicked shows list of facets available to filter a report on.
 *  When the list is shown and the trigger button is clicked again it hides the FacetMenu.
 *
 *  For each field with facet values there is collapsible field header and the list of facetItems
 *
 *  The FacetsMenu has a trigger button and the FacetsList
**/
const FacetsMenu = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin('FacetMenuStore')],

    displayName: 'FacetsMenu',
    contextTypes: {
        touch: React.PropTypes.bool
    },

    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of facets
         *  and a function to call when a facet value is selected.
         **/
        reportData: React.PropTypes.shape({
            data: React.PropTypes.shape({
                facets:  facetsProp
            })
        }),
        onFacetSelect : React.PropTypes.func,
        maxInitRevealed: React.PropTypes.number,
        onMenuEnter : React.PropTypes.func,
        onMenuExit : React.PropTypes.func
    },


    getStateFromFlux() {
        let flux = this.getFlux();
        return flux.store('FacetMenuStore').getState();
    },

    componentDidMount() {
        let flux = this.getFlux();
        if (!this.props.allInitiallyCollapsed) {
            let expanded = [];
            // if we don't start with all collapsed then
            // add all facet fids to list of expanded facet fields
            if (this.props.reportData.data && this.props.reportData.data.facets) {
                this.props.reportData.data.facets.forEach((facet) => expanded.push(facet.id));
                flux.actions.setFacetsExpanded({expanded});
            }
        }
    },

    /**
     *
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
     * Changes the state of a facet field group to collapsed if parameter makeCollapsed is true or expanded if not
     * by adding or removing the field id from a hash listing the expanded facet field groups
     *
     * @param facetField - the facet
     * @param makeCollapsed
     *
     **/
    setFacetCollapsed(facetField, makeCollapsed) {
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
        let flux = this.getFlux();
        flux.actions.setFacetsExpanded({expanded});
    },

    /**
     * Invokes the action to change the state of a facet field group to more revealed
     * by adding the field id from a hash listing the more Revealed facet field groups
     *
     * @param facetField - the facet
     *
     **/
    setFacetMoreRevealed(facetField) {
        let moreRevealed = _.clone(this.state.moreRevealedFacetFields);
        // add it
        moreRevealed.push(facetField.id);
        let flux = this.getFlux();
        flux.actions.setFacetsMoreRevealed({moreRevealed});
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
     * Toggle the state of expand Collapse of a facet field group in the popover
     * change state of a facet from expanded to collapsed or collapsed to expanded
     * @param e - the event object from the browser/react
     * @param facetField - the fact field you want to toggle
     **/
    handleToggleCollapse(facetField, e) {
        if (e && e.currentTarget) {
            e.currentTarget.scrollIntoView(true);
        }
        this.setFacetCollapsed(facetField, !this.isCollapsed(facetField.id));
    },

    /**
     * Handle the ui event that occurred - handled changing the show more state of a
     * facet field group. To make the remainder of facet field groups values shown.
     *
     * @param e - the event object from the browser/react
     * @param facetField - the facet field group to act on
     **/
    handleRevealMore(e, facetField) {
        this.setFacetMoreRevealed(facetField);
    },

    /**
     * Don't handle other listeners i.e. avoid closing facet window on this click
     * outside event
     * (we want to keep open on facet selections clicks)
     * @param e
     */
    dontClose(e) {
        // prevent close of popover just do the clear
        e.stopPropagation();
        if (e.nativeEvent &&  e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
    },

    /**
     * Clear the selected value,
     * @param e
     * @param facet
     * @param value
     */
    clearSelect(e, facet, value) {
        this.props.onFacetDeselect(e, facet, value);
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
        this.props.reportData.data.facets.map((facet) => {
            if (selections.hasAnySelectionsForField(facet.id)) {
                let kids = (selections.getFieldSelections(facet.id).map((value) => {
                    return (
                        <QBToolTip tipId={`selectedToken{facet.name}`} i18nMessageKey="report.facets.clearFacetSelection">
                            <span key={'token.' + facet.name + '.' + value}
                                  className="selectedToken"
                                  onClick={(e) => self.clearSelect(e, facet, value)}>
                                <span className="selectedTokenName">
                                    <span>{value}</span>
                                    <QBicon className="clearFacet" icon="clear-mini"/>
                                </span>
                            </span>
                        </QBToolTip>
                    );
                }));
                components.push(<div className="facetToken" key={'token' + facet.name} ><span className="facetNameToken">{facet.name}</span>
                    <span className="facetSelections">{kids}</span></div>);
            }
        });
        return components;
    },

    hideMenu() {
        this.showMenu(false);
    },

    showMenu(newState) {
        let flux = this.getFlux();
        if (flux && flux.actions && flux.actions.showFacetMenu) {
            flux.actions.showFacetMenu({show: newState});
        }
    },

    /**
     * Prepares the facet menu button used to show/hide the popover menu of field facet groups when clicked
     *
     **/
    render() {
        let menuKey =  this.props.rptId;
        let hasSelections = this.props.selectedValues && this.props.selectedValues.hasAnySelections();

        return (
            <div className="facetsMenuContainer">

                {/* the filter icon button */}
                <div className={"facetsMenuButton " +  (this.state.show ? "popoverShown" : "") +
                  (hasSelections ? " withSelections " : " withoutSelections") +
                  (this.state.show ? " ignore-react-onclickoutside" : "")}
                     ref="facetsMenuButton"
                     >
                    <span className="facetButtons" onClick={() => this.showMenu(!this.state.show)}>
                        <QBToolTip location="bottom" tipId="filterButton" i18nMessageKey="report.facets.filter">
                        <QBicon className="filterButton" icon={(hasSelections) ?
                                    "filter-status" : "filter-tool"} />
                        <QBicon className="filterButtonCaret" icon="caret-filled-down" />
                            </QBToolTip>
                    </span>
                </div>

                {/* list of facet options shown when filter icon clicked */}
                <Overlay container={this} placement="bottom"
                         ref="facetOverlayTrigger"
                         show={this.state.show}
                         onHide={this.hideMenu}
                         onEntering={this.props.onMenuEnter} onExited={this.props.onMenuExit} >
                                    <div className={"facetsRelativePos" +
                                                (this.state.show ? " ignore-react-onclickoutside" : "")}>
                                        <FacetsList
                                            ref="facetsPopover"
                                            key= {"FacetsList." + menuKey}
                                            popoverId={menuKey || 1}
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
                                            hideMenu={this.hideMenu}
                                            onFacetDeselect={this.props.onFacetDeselect}
                                    /></div>
                </Overlay>
                {!this.context.touch &&
                <div className="selectedFacets ignore-react-onclickoutside" ref="selectedFacets"
                     >{this.renderSelectedFacets()}</div>
                }

            </div>
        );
    }
});

export default FacetsMenu;
