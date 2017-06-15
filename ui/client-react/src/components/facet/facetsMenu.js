import React, {Component, PropTypes} from 'react';
import {Overlay} from 'react-bootstrap';
import _ from 'lodash';
import {connect} from "react-redux";
import LimitConstants from '../../../../common/src/limitConstants';
import Logger from "../../utils/logger";
import * as SchemaConsts from '../../constants/schema';

//IMPORT FROM reuse
import Icon from '../../../../reuse/client/src/components/icon/icon';
import Tooltip from '../../../../reuse/client/src/components/tooltip/tooltip';
import  {facetsProp} from '../../../../reuse/client/src/components/facets/facetProps';
import GenericFacetMenu from '../../../../reuse/client/src/components/facets/genericFacetMenu';
import {showFacetMenu, hideFacetMenu, setFacetsExpanded, setFacetsMoreRevealed} from '../../../../reuse/client/src/components/facets/facetMenuActions';
import {getExpandedFacetFields, getMoreRevealedFacetFields} from '../../../../reuse/client/src/components/facets/facetMenuReducer';
import '../../../../reuse/client/src/components/facets/facet.scss';
//IMPORT FROM REUSE

let logger = new Logger();
/**
 *  FacetsMenu component presents a trigger button that when clicked shows list of facets available to filter a report on.
 *  When the list is shown and the trigger button is clicked again it hides the FacetMenu.
 *
 *  For each field with facet values there is collapsible field header and the list of facetItems
 *
 *  The FacetsMenu has a trigger button and the FacetsList
**/
export class FacetsMenu extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'FacetsMenu';
    }

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
    }

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
    }

    /**
     * Check if a facet field group section has more revealed or not
     *
     * @param id - the id of field to check
     * @returns {boolean} returns true if it's revealed
     **/
    isRevealed = (id) => {
        return (_.includes(this.props.moreRevealedFacetFields, id));
    }

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
    }

    /**
     * Handle the ui event that occurred - handled changing the show more props of a
     * facet field group. To make the remainder of facet field groups values shown.
     *
     * @param e - the event object from the browser/react
     * @param facetField - the facet field group to act on
     **/
    handleRevealMore = (e, facetField) => {
        this.setFacetMoreRevealed(facetField);
    }

    /**
     *  Hides the facets menu when clicked
     */
    hideMenu = () => {
        this.showMenu();
    }

    /**
     *  Get the id from the object which contains the expanded facet fields
     */
    getExpandedFacetFieldsArray = () => {
        if (!this.props.expandedFacetFields) {
            return [];
        }

        return Object.keys(this.props.expandedFacetFields).map(key => this.props.expandedFacetFields[key]);
    }

    /**
     *  Shows the menu when clicked
     */
    showMenu = () => {
        if (this.props.show) {
            if (this.props.hideFacetMenu) {
                this.props.hideFacetMenu();
            }
        } else if (this.props.showFacetMenu) {
            this.props.showFacetMenu();
        }
    }

    /**
     *  Get the facets object from the reportData that is passed
     *  Add a check for "More" if the number of facets item is more than the set value
     *  Renders only the number of facets items specified, Here set to 5
     */
    getFacets = () => {
        if (!_.has(this.props, 'reportData.data.facets') || !Array.isArray(this.props.reportData.data.facets)) {
            return [];
        }

        let facets = this.props.reportData.data.facets;

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
            let isRevealed = this.isRevealed(facet.id);

            return {
                ...facet,
                hasMore: facet.values.length > LimitConstants.maxFacetValuesInitiallyRevealed && !isRevealed,
                values: isRevealed ? facet.values : _.take(facet.values, LimitConstants.maxFacetValuesInitiallyRevealed),
            };
        });

    }

    /**
     * Prepares the facet menu button used to show/hide the popover menu of field facet groups when clicked
     *
     **/
    render() {
        let menuKey =  this.props.rptId;
        let selectedValues = (this.props.selectedValues ? this.props.selectedValues.getSelections() : {});

        return <GenericFacetMenu selectedFacetValues={selectedValues}
                                 isMenuVisible={this.props.show}
                                 onClickFacetMenu={this.showMenu}
                                 id={menuKey}
                                 onClickShowMore={this.handleRevealMore}
                                 expandedFacets={this.getExpandedFacetFieldsArray()}
                                 facets={this.getFacets()}
                                 onClickFacet={this.handleToggleCollapse}
                                 onClickFacetValue={this.props.onFacetSelect}
                                 onClickClearFacetValues={this.props.onFacetClearFieldSelects}
                                 showSelectedFacetTokens={!this.context.touch}
                                 menuVisibilityChanged={this.hideMenu}
                />;
    }
}

FacetsMenu.propTypes = {
    /**
     *  Takes in for properties the reportData which includes the list of facets
     *  and a function to call when a facet value is selected.
     **/
    reportData: React.PropTypes.shape({
        data: React.PropTypes.shape({
            facets:  facetsProp
        })
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

FacetsMenu.contextTypes = {
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
        moreRevealedFacetFields: getMoreRevealedFacetFields(state)
    };
};

const mapDispatchToProps = {
    showFacetMenu,
    hideFacetMenu,
    setFacetsExpanded,
    setFacetsMoreRevealed
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FacetsMenu);
