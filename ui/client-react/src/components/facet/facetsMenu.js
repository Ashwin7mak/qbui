import React from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';

import QBicon from '../qbIcon/qbIcon';
import FacetsList from './facetsList';

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
        onFacetSelect : React.PropTypes.func
    },

    /**
     * Initializes the states:
     *  - (shown)  : Facet List popover shown state or not shown
     *  - (expandedFacetFields) : the facet fields sections in the
     *                          popover that are expanded (initialized using the allInitiallyCollapsed prop setting)
     *  - (selected): set of selected facet values
     *
     * @returns {{show: boolean, expandedFacetFields: Array, selected: Array}}
     */
    getInitialState() {
        //TODO: move these to use fluxxor actions and stores to make the sticky across views.
        let expanded = [];
        if (!this.props.allInitiallyCollapsed) {
            // if we don't start with all collapsed then
            // add all facet fids to list of expanded facet fields
            if (this.props.reportData.data && this.props.reportData.data.facets && this.props.reportData.data.facets.list) {
                for (let facet of this.props.reportData.data.facets.list) {
                    expanded.push(facet.id);
                }
            }
        }
        return {
            show: false,
            expandedFacetFields: expanded,
        };
    },

    /**
     * Specifies what to use for the default collapse/expand mode to use for all the fields facets
     *
     * @returns {{allInitiallyCollapsed: boolean}}
     */
    getDefaultProps() {
        return {
            allInitiallyCollapsed : true
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
    setFacetState(facetField, makeCollapsed) {
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
     * Check if a facet field group section is collapsed or not
     *
     * @param id - the id of field to check
     * @returns {boolean} returns true if it's collapsed
     **/
    isCollapsed(id) {
        return (!_.includes(this.state.expandedFacetFields, id));
    },


    /**
     * Toggle the fate of expand Collapse of a facet field group in the popover
     * change state of a facet from expanded to collapsed or collapsed to expanded
     * @param facetField - the fact field you want to toggle
     **/
    toggleCollapseFacet(facetField) {
        this.setFacetState(facetField, !this.isCollapsed(facetField.id));
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
     * Prepares the facet menu button used to show/hide the popover menu of field facet groups when clicked
     *
     **/
    render() {
        return (
            <div className="facetsMenuContainer">
                {/*  list of facet options shown when filter icon clicked */}
                <OverlayTrigger container={this} trigger="click"
                                placement="bottom"
                                overlay={<FacetsList
                                    handleToggleCollapse={this.handleToggleCollapse}
                                    isCollapsed={this.isCollapsed}
                                    {...this.props} />}
                >
                    {/* the filter icon */}
                    <div className="facetsMenuButton"
                         onClick={e => this.toggleMenu(e)}
                    >
                        <QBicon icon="filter-tool" />
                        <QBicon icon="caret-filled-down" />
                    </div>
                </OverlayTrigger>
            </div>
        );
    }
});

export default FacetsMenu;
