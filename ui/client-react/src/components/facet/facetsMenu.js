import React from 'react';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';

import FacetsItem from './facetsItem';
import Hicon from '../harmonyIcon/harmonyIcon';

import './facet.scss';
import _ from 'lodash';

let logger = new Logger();

/**
 *  FacetsMenu component presents a list of facets available to filter the report on when its button is clicked.
 *  for each field with facet values there is collapsable field header and the list of facet values
**/
let FacetsMenu = React.createClass({
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
     * function getInitalState
     * intializes the:
     * - Facterlist popover (shown) state to not shown
     *  -  collapse/expand state (expandedFacetFields) of all the facet fields sections in the
     * popover using the allInitiallyCollapsed prop setting
     *  - selected set of facet values (selected) state to nothing selected
     *
     * @returns {{show: boolean, expandedFacetFields: Array, selected: Array}}
     */
    getInitialState() {
        //TODO: move these to use fluxxor actions and stores to make the sticky across views.
        let expanded = [];
        let selected = [];
        if (!this.props.allInitiallyCollapsed){
            // if we don't start with all collapsed then
            // add all facet fids to list of expanded facet fields
            if (this.props.reportData.data && this.props.reportData.data.facets && this.props.reportData.data.facets.list) {
                for (let facet of this.props.reportData.data.facets.list){
                    expanded.push(facet.id);
                }
            }
        }
        return {
            show: false,
            expandedFacetFields: expanded,
            selected : selected
        };
    },

    /**
     * function: getDefaultProps
     * specifies what to use for the default collapse/expand mode to use for all the fields facets
     * @returns {{allInitiallyCollapsed: boolean}}
     */
    getDefaultProps() {
        return {
            allInitiallyCollapsed : true
        };
    },

    /**
     * function : toggleMenu
     * changes of the state of the facet popover to hidden or shown
      * @param e
     */
    toggleMenu(e) {
        this.setState({target: e.target, show: !this.state.show});
    },

    /**
     * function: setFacetState
     * change state of a facet field group to collapsed if parameter makeCollapsed is true or expanded if not
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
            if (_.includes(expanded, facetField.id)){
                _.pull(expanded, facetField.id);
            }
        } else {
            // add it to toggle from collapsed state
            expanded.push(facetField.id);
        }
        this.setState({expandedFacetFields: expanded});
    },

    /**
     * function : isCollapsed
     * Check if a facet field group section is collapsed or not
     *
     * @param id - the id of field to check
     * @returns {boolean} returns true if it's collapsed
     **/
    isCollapsed(id) {
        return (!_.includes(this.state.expandedFacetFields, id));
    },


    /**
     * function: toggleCollapseFacet
     * Toggle the fate of exppand Collapse of a facet field group in the popover
     * change state of a facet from expanded to collapsed or collapsed to expanded
     * @param facetField - the fact field you want to toggle
     **/
    toggleCollapseFacet(facetField) {
        this.setFacetState(facetField, !this.isCollapsed(facetField.id));
    },

    /**
     * function: handleToggleCollapse
     * handle the ui request ofevent occurs to handled changing the collapse/expand state of a
     * facet field group. To make the facet field groups values hidden or shown.
     * @param e - the event object from the browser/react
     * @param facetField - the facet field group to act on
     **/
    handleToggleCollapse(e, facetField) {
        //logger.debug("got toggle collapse on field id " + facetField.id);
        this.toggleCollapseFacet(facetField);
    },

    /**
     * function: render
     * prepars the facet menu button used to show/hide the popover menu of feild aet groups when clicked
     **/

    render() {
        return (
            <div ref="facetsMenuContainer" class="facetsMenuContainer">
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
                        <Hicon icon="filter" />
                    </div>
                 </OverlayTrigger>
            </div>
            );
    }
});

let FacetsList = React.createClass({
    facetsList(facetsData) {
        return facetsData.list.map((facetField, index) => {
            return <FacetsItem eventKey={facetField} key={facetField.id}
                               facet={facetField}
                               ref={facetField.id}
                               expanded={!this.props.isCollapsed(facetField.id)}
                               handleToggleCollapse={this.props.handleToggleCollapse}
                               handleSelectValue={this.props.onFacetSelect}
                {...this.props} />;
        });
    },

    render(){
        /**
         * arrowed box with contents of the facet menu list of items
         **/
        const style = {
            marginLeft: -4,
            borderRadius: 3,
            minWidth: 220
        };
        return (
            <Popover fstyle={style}
                     id="facetsMenuPopup"
                     arrowOffsetLeft={28}
                     placement="bottom"
                     className="facetMenuPopup">
                {this.props.reportData && this.props.reportData.data && this.props.reportData.data.facets && this.props.reportData.data.facets.list ?
                    this.facetsList(this.props.reportData.data.facets) :
                    "No Facets"
                }
            </Popover>
        );
    }
});

export default FacetsMenu;
