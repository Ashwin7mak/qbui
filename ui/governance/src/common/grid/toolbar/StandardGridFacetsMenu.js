import React, {Component, PropTypes} from "react";
import {facetsProp} from "../../../../../reuse/client/src/components/facets/facetProps";
import _ from "lodash";
import {connect} from "react-redux";
import GenericFacetMenu from "../../../../../reuse/client/src/components/facets/genericFacetMenu";
import {
    showFacetMenu,
    hideFacetMenu,
    setFacetsExpanded,
    setFacetsMoreRevealed,
    toggleFacetMenu
} from "../../../../../reuse/client/src/components/facets/facetMenuActions";
import {
    getExpandedFacetFields,
    getMoreRevealedFacetFields
} from "../../../../../reuse/client/src/components/facets/facetMenuReducer";
import "../../../../../reuse/client/src/components/facets/facet.scss";
import LimitConstants from "../../../../../common/src/limitConstants";
import Logger from "../../../../../client-react/src/utils/logger";
import * as SchemaConsts from "../../../../../client-react/src/constants/schema";
import "./StandardGridToolBar.scss";

let logger = new Logger();
/**
 *  FacetsMenu component presents a trigger button that when clicked shows list of facets available to filter a grid on.
 *  When the list is shown and the trigger button is clicked again it hides the FacetMenu.
 *
 *  For each field with facet values there is collapsible field header and the list of facetItems
 *
 *  The FacetsMenu has a trigger button and the FacetsList
 **/
export class StandardGridFacetsMenu extends Component {
    /**
     * Changes the props of a facet field group to collapsed if parameter makeCollapsed is true or expanded if not
     * by adding or removing the field id from a hash listing the expanded facet field groups
     *
     * @param facetField - the facet
     * @param makeCollapsed
     *
     **/
    setFacetCollapsed = (facetField, isExpanded) => {
        if (!this.props.expandedFacetFields) {
            return;
        }

        let expanded = _.clone(this.props.expandedFacetFields);
        if (isExpanded) {
            //in expanded set?  remove to mark it collapsed
            if (_.includes(expanded, facetField.id)) {
                _.pull(expanded, facetField.id);
            }
        } else {
            // add it to toggle from collapsed props
            expanded.push(facetField.id);
        }

        this.props.setFacetsExpanded({expanded});
    };

    /**
     * Invokes the action to change the props of a facet field group to more revealed
     * by adding the field id from a hash listing the more Revealed facet field groups
     *
     * @param facetField - the facet
     *
     **/
    setFacetMoreRevealed = (facetField) => {
        let moreRevealed = _.clone(this.props.moreRevealedFacetFields);
        // add it
        moreRevealed.push(facetField.id);
        this.props.setFacetsMoreRevealed({moreRevealed});
    };

    /**
     * Check if a facet field group section has more revealed or not
     *
     * @param id - the id of field to check
     * @returns {boolean} returns true if it's revealed
     **/
    isRevealed = (id) => {
        return (_.includes(this.props.moreRevealedFacetFields, id));
    };

    /**
     * Toggle the props of expand Collapse of a facet field group in the popover
     * change props of a facet from expanded to collapsed or collapsed to expanded
     * @param e - the event object from the browser/react
     * @param facetField - the fact field you want to toggle
     **/
    handleToggleCollapse = (facetField, isExpanded, e) => {
        if (e && e.currentTarget) {
            e.currentTarget.scrollIntoView(true);
        }
        this.setFacetCollapsed(facetField, isExpanded);
    };

    /**
     * Handle the ui event that occurred - handled changing the show more props of a
     * facet field group. To make the remainder of facet field groups values shown.
     *
     * @param e - the event object from the browser/react
     * @param facetField - the facet field group to act on
     **/
    handleRevealMore = (e, facetField) => {
        this.setFacetMoreRevealed(facetField);
    };

    /**
     *  Get the id from the object which contains the expanded facet fields
     */
    getExpandedFacetFieldsArray = () => {
        if (!this.props.expandedFacetFields) {
            return [];
        }

        return Object.keys(this.props.expandedFacetFields).map(key => this.props.expandedFacetFields[key]);
    };

    /**
     *  Function that toggles the show and hide state for the facet menu when clicked
     */
    changeMenuVisibility = (isMenuVisible) => {
        if (this.props.toggleFacetMenu) {
            return this.props.toggleFacetMenu(isMenuVisible);
        }
    };

    /**
     *  Get the facets object from the facetFields that is passed
     *  NOT NEEDED FOR NOW:
     *  Add a check for "More" if the number of facets item is more than the set value
     *  Renders only the maximum number of facets items specified at the first instance, Here set to 5
     */
    getFacets = () => {
        if (!_.has(this.props, 'facetFields.facets') || !Array.isArray(this.props.facetFields.facets)) {
            return [];
        }

        let facets = this.props.facetFields.facets;

        // filter out the date and user fields for now
        // TODO: support date ranges in filtering see https://jira.intuit.com/browse/QBSE-20422
        if (facets.length) {
            facets = facets.filter((facetField) => {
                // If type is not specified, then assume it is ok.
                if (!facetField.type) {
                    return true;
                }

                return !(facetField.type.toUpperCase().includes(SchemaConsts.DATE) || facetField.type.toUpperCase().includes(SchemaConsts.USER));
            });
        }

        return facets.map((facet) => {
            // We don't need it for now, but for future cases
            let isRevealed = this.isRevealed(facet.id);

            return {
                ...facet,
                hasMore: facet.values.length > LimitConstants.maxFacetValuesInitiallyRevealed && !isRevealed,
                values: isRevealed ? facet.values : _.take(facet.values, LimitConstants.maxFacetValuesInitiallyRevealed),
            };
        });
    };

    /**
     * Prepares the facet menu button used to show/hide the popover menu of field facet groups when clicked
     *
     **/
    render() {
        let selectedValues = (this.props.selectedValues ? this.props.selectedValues : {});

        return <GenericFacetMenu isMenuVisible={this.props.show}
                                 onClickFacetMenu={this.changeMenuVisibility}
                                 onClickShowMore={this.handleRevealMore}
                                 expandedFacets={this.getExpandedFacetFieldsArray()}
                                 facets={this.getFacets()}
                                 onClickFacet={this.handleToggleCollapse}
                                 onClickFacetValue={this.props.onFacetSelect}
                                 onClickClearFacetValues={this.props.onFacetClearFieldSelects}
                                 showSelectedFacetTokens={!this.context.touch}
                                 menuVisibilityChanged={this.changeMenuVisibility}
                                 selectedFacetValues={selectedValues}
        />;
    }
}

StandardGridFacetsMenu.propTypes = {
    /**
     *  Takes in for properties the facetFields which includes the list of facets
     *  and a function to call when a facet value is selected.
     **/
    facetFields: React.PropTypes.shape({
        facets:  facetsProp
    }),
    /**
     *  Function that handles what happens when a facet value is clicked
     */
    onFacetSelect : React.PropTypes.func,
    /**
     *  Clears the selected fields onclick
     */
    onFacetClearFieldSelects: React.PropTypes.func,
    /**
     *  Has the selected facet values in an array
     */
    selectedValues: React.PropTypes.object,
};

StandardGridFacetsMenu.contextTypes = {
    touch: React.PropTypes.bool
};

const mapStateToProps = (state) => {
    let newState = state && state.facets ? state.facets : {};
    return {
        /**
         *  Prop that shows whether the menu is shown or hidden
         *  Initially set to false and set to true when Facets Menu is clicked
         */
        show: (_.has(newState, "show") ? newState.show : false),
        /**
         *  Prop that renders the facets based upon action triggered by setFacetsExpanded
         */
        expandedFacetFields: getExpandedFacetFields(state),
        /**
         *  Prop that renders the extra set of facets that goes beyond the initially shown value
         */
        moreRevealedFacetFields: getMoreRevealedFacetFields(state),
    };
};

const mapDispatchToProps = {
    showFacetMenu,
    hideFacetMenu,
    toggleFacetMenu,
    setFacetsExpanded,
    setFacetsMoreRevealed
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardGridFacetsMenu);
