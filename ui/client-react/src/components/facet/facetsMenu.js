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

/*
 FacetsMenu component presents a list of facets available to filter the report on when its button is clicked.
 for each field with facet values there is collapsable field header and the list of facet values
*/

let FacetsMenu = React.createClass({
    /* Takes the reportData which includes the list of facets
    and a function to call when a facet value is selected.
    */
    propTypes: {
        reportData: React.PropTypes.shape({
            data: React.PropTypes.shape({
                facets:  React.PropTypes.shape({
                    list: React.PropTypes.array.isRequired
                })
            })
        }),
        onFacetSelect : React.PropTypes.func
    },

    getInitialState() {
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

    getDefaultProps() {
        return {
            allInitiallyCollapsed : true
        };
    },

    toggleMenu(e) {
        this.setState({target: e.target, show: !this.state.show});
    },

    /**
     * change state of a facet to collapsed if parameter makeCollapsed is true or expanded if not
     * by adding or removing the field id from a hash listing the expanded fields
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

    isCollapsed(id) {
        return (!_.includes(this.state.expandedFacetFields, id));
    },

    /**
     * change state of a facet from expanded to collapsed or collapsed to expanded
     **/
    toggleCollapseFacet(facetField) {
        this.setFacetState(facetField, !this.isCollapsed(facetField.id));
    },

    handleToggleCollapse(e, facetField) {
        //logger.debug("got toggle collapse on field id " + facetField.id);
        this.toggleCollapseFacet(facetField);
    },


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
                         //ref="facetsMenuButton"
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
