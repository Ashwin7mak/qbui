import React, {Component, PropTypes} from 'react';
import {Overlay} from 'react-bootstrap';
import Icon from '../icon/icon';
import Tooltip from '../tooltip/tooltip';
import GenericFacetsList from './genericFacetsList';
import _ from 'lodash';
import './facet.scss';

// IMPORTS FROM CLIENT REACT
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
// IMPORTS FROM CLIENT REACT

/**
 *  FacetsMenu component presents a trigger button that when clicked shows list of facets available to filter data on.
 *  When the list is shown and the trigger button is clicked again it hides the FacetMenu.
 *
 *  For each field with facet values there is collapsible field header and the list of facetItems.
 *
 *  See the facetMenuReducer and facetMenuActions for possible state implementations for this component.
 **/
export class GenericFacetMenu extends Component {

    /**
     * Checks list of facet values to see any facet were selected
     */
    hasAnySelections = () => {
        if (!this.props.selectedFacetValues) {
            return false;
        }

        if (Object.keys(this.props.selectedFacetValues).length === 0) {
            return false;
        } else {
            return _.some(this.props.selectedFacetValues, selections => {
                return (selections && (selections.length > 0));
            });
        }
    }

    /**
     *  Checks whether the facets menu has any selections
     */
    doesFacetHaveSelections = (facet) => {
        return this.getFieldSelections(facet).length > 0;
    }

    /**
     *  Gets the selected facets based on ID
     */
    getFieldSelections = (facet) => {
        if (this.props.selectedFacetValues && this.props.selectedFacetValues[facet.id]) {
            return this.props.selectedFacetValues[facet.id];
        } else {
            return [];
        }
    }

    /**
     *  Shows the menu onClick
     *  Sets the value of menuVisibilityChanged to true
     */
    onMenuShow = () => {
        if (this.props.menuVisibilityChanged) {
            return this.props.menuVisibilityChanged(true);
        }
    }

    /**
     *  Hides the menu onClick
     *  Sets the value of menuVisibilityChanged to false
     */
    onMenuHide = () => {
        if (this.props.menuVisibilityChanged) {
            return this.props.menuVisibilityChanged(false);
        }
    };

    /**
     *  Function that shows or hides the facets meny when clicked
     */
    onClickFacetMenu = () => {
        if (this.props.onClickFacetMenu)        {
            this.props.onClickFacetMenu(this.props.isMenuVisible);
        }
    }

    /**
     * Don't handle other listeners i.e. avoid closing facet window on this click
     * outside event
     * (we want to keep open on facet selections clicks)
     * @param e
     */
    dontClose = (e) => {
        // prevent close of popover just do the clear
        e.stopPropagation();
        if (e.nativeEvent &&  e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
    }

    /**
     * Clear the selected value,
     * @param e
     * @param facet
     * @param value
     */
    clearSelect = (e, facet, value) => {
        this.props.onClickFacetValue(facet, value, e);
        this.dontClose(e);
    }

    /**
     * render the selected facet value tokenized
     * @returns {null}
     */
    renderSelectedFacets = () => {
        let selections = this.props.selectedFacetValues;
        if (!selections || !this.hasAnySelections()) {
            return null;
        }
        let components = [];
        let self = this;
        this.props.facets.forEach((facet) => {
            if (this.doesFacetHaveSelections(facet)) {
                let kids = (this.getFieldSelections(facet).map((value) => {
                    return (
                        <Tooltip tipId={`selectedToken{facet.name}`} i18nMessageKey="report.facets.clearFacetSelection">
                            <span key={'token.' + facet.name + '.' + value}
                                  className="selectedToken"
                                  onClick={(e) => self.clearSelect(e, facet, value)}>
                                <span className="selectedTokenName">
                                    <span>{value}</span>
                                    <Icon className="clearFacet" icon="clear-mini"/>
                                </span>
                            </span>
                        </Tooltip>
                    );
                }));
                components.push(
                    <div className="facetToken" key={'token' + facet.name}>
                        <span className="facetNameToken">{facet.name}</span>
                        <span className="facetSelections">{kids}</span>
                    </div>
                );
            }
        });
        return components;
    }

    /**
     * Don't show tokens on small breakpoints by default. Otherwise, use the showSelectedFacetTokens prop if provided.
     * @returns {*}
     */
    shouldDisplayFacetTokens = () => {
        if (typeof this.props.showSelectedFacetTokens !== 'boolean') {
            return Breakpoints.isNotSmallBreakpoint();
        }

        return this.props.showSelectedFacetTokens;
    }

    /**
     * Prepares the facet menu button used to show/hide the popover menu of field facet groups when clicked
     *
     **/
    render() {
        let menuKey =  this.props.id;
        let hasSelections =  this.hasAnySelections();

        return (
            <div className="facetsMenuContainer">

                {/* the filter icon button */}
                <div className={"facetsMenuButton " +  (this.props.isMenuVisible ? "popoverShown" : "") +
                (hasSelections ? " withSelections " : " withoutSelections") +
                (this.props.isMenuVisible ? " ignore-react-onclickoutside" : "")}
                     ref="facetsMenuButton"
                >
                    <span className="facetButtons" onClick={this.onClickFacetMenu}>
                        <Tooltip location="bottom" tipId="filterButton" i18nMessageKey="report.facets.filter">
                            <Icon className="filterButton" icon={(hasSelections) ?  "filter-status" : "filter-tool"} />
                            <Icon className="filterButtonCaret" icon="caret-filled-down" />
                        </Tooltip>
                    </span>
                </div>

                {/* list of facet options shown when filter icon clicked */}
                <Overlay container={this} placement="bottom"
                         ref="facetOverlayTrigger"
                         show={this.props.isMenuVisible}
                         onHide={this.onMenuHide} >
                    <div className={"facetsRelativePos" +
                    (this.props.isMenuVisible ? " ignore-react-onclickoutside" : "")}>
                        <GenericFacetsList  ref="facetsPopover"
                                            key= {"FacetsList." + menuKey}
                                            popoverId={menuKey || 1}
                                            onClickShowMore={this.props.onClickShowMore}
                                            expandedFacets={this.props.expandedFacets}
                                            selectedFacetValues={this.props.selectedFacetValues}
                                            facets={this.props.facets}
                                            onClickFacet={this.props.onClickFacet}
                                            onMenuHide={this.onMenuHide}
                                            onClickFacetValue={this.props.onClickFacetValue}
                                            onMenuShow={this.onMenuShow}
                                            onClickClearFacetValues={this.props.onClickClearFacetValues}
                        />
                    </div>
                </Overlay>
                {this.shouldDisplayFacetTokens() &&
                    <div className="selectedFacets ignore-react-onclickoutside" ref="selectedFacets">
                        {this.renderSelectedFacets()}
                    </div>
                }
            </div>
        );
    }
}

GenericFacetMenu.propTypes = {
    /**
     * A unique identifier for this component if there are multiple grids/facet menus on the page.
     */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Controls whether the menu is displayed.
     */
    isMenuVisible: PropTypes.bool,

    /**
     * Callback that is fired when the facet icon (menu trigger) is clicked.
     * Typically, this should update the state that controls the `isMenuVisible` prop for this component.
     */
    onClickFacetMenu: PropTypes.func,

    /**
     * An array of facets that will be displayed in the menu.
     */
    facets: PropTypes.arrayOf(PropTypes.shape({
        // The id of the facet
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        // The name of the facet which appears in the menu
        name: PropTypes.string,

        // An array of values for the facet. You should only pass in those values which you want to be displayed in the menu.
        // For example, if you are using the "hasMore" button, only pass in the first five values until the `handleRevealMore` callback has been fired.
        // Then pass in the additional values.
        values: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])
        })),

        // Optional. The Schema Type of the facet. This can be used to format checkbox values as yes/no. Use the
        // src/constants/schemaConsts - CHECKBOX value for boolean types.
        // Anything with a type of DATE or USER will be automatically filtered out as those data types are not currently supported.
        type: PropTypes.string,

        // Optional. Show a "show more" button at the bottom of the list of values. See `handleRevealMore` for more information.
        hasMore: PropTypes.bool,
    })),

    /**
     *  An array of facet ids. Facets in this array will show their values in the menu. I.e., the facet panel will be expanded
     *  for these facets.
     */
    expandedFacets: PropTypes.array,

    /**
     * An object that describes which facet values have been selected. Values in this list will have a checkmark next to them in the menu.
     * Object keys are the facet id's with an array of selected values. Facets without any selected values can be omitted or have an empty array.
     * { 1: [], 2: ['yes'], 3: ['bob', 'sue'] }
     */
    selectedFacetValues: PropTypes.object,

    /**
     * Callback that fires when a facet it clicked. Typically when using this component, this callback would trigger
     * a state update that would toggle that facet from the `expandedFacetFields` array. See the `facetMenuActions` for a possible implementation.
     *
     * This callback receives 3 arguments:
     * 1. The facet object
     * 2. The current expanded state of the facet (boolean, true for expanded, false for collapsed)
     * 3. The click event
     */
    onClickFacet: PropTypes.func,

    /**
     *  A callback that is fired when a value for a facet is clicked. E.g., when the value "yes" is clicked for the "Checkbox" facet.
     *  Typically this will result in the state being update such that the value is toggled in the `selectedFacetValues` object.
     *
     *  This callback will receive 3 arguments:
     *  1. The facet object
     *  2. The facet value that was clicked
     *  3. The click event
     */
    onClickFacetValue: PropTypes.func,

    /**
     * A callback that is fired when the user clicks the "show more" button at the bottom of a shortened list of facet values.
     * This callback typically updates the state so that additional values are appended to the array of values for that facet.
     * FACET NAME
     * - Facet value 1
     * - Facet value 2
     * - (Show More)
     *
     * This callback will receive 2 arguments:
     * 1. The facet (object) that was clicked
     * 2. The click event
     */
    onClickShowMore: PropTypes.func,

    /**
     * This callback is fired when the remove icon is clicked next to a Facet. It typically clears all of the selected values for that facet.
     *
     * This callback will receive one argument: The facet (object) that was clicked
     */
    onClickClearFacetValues: PropTypes.func,

    /**
     * A callback which lets the parent know the visibility changed within the component.
     * This component has a behavior where if you click outside of the menu, the menu will close. When that happens, this callback
     * will be fired so that the parent can update the state.
     * The callback receives one argument "isMenuVisible"
     */
    menuVisibilityChanged: PropTypes.func,

    /**
     * A flag to show or hide the selected facet tokens that can appear next to the filter icon.
     * This is disabled on small breakpoint by default.
     */
    showSelectedFacetTokens: PropTypes.bool,
};

GenericFacetMenu.defaultProps = {
    isMenuVisible: false,
    facets: [],
    expandedFacetFields: [],
    selectedFacetValues: []
};

export default GenericFacetMenu;
