import React from 'react';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';

import FacetsItem from './facetsItem';
import QBicon from '../qbIcon/qbIcon';

import './facet.scss';
import _ from 'lodash';

let logger = new Logger();

/**
 *  FacetsList component presents a list of facets available to filter the report on;
 *  For each facet field in the list it will make a FacetsItem component
 **/
var FacetsList = React.createClass({
    /**
     * Renders each field inf the list of facet fields with FacetItem component
     *
     * @param facetsData - the list of facet field object
     * @returns the prepared set of FacetsItem components for rendering
     */
    displayName: 'FacetsList',
    facetsList(facetsData) {
        return facetsData.list.map((facetField, index) => {
            var fid = facetField.id;
            return <FacetsItem eventKey={facetField} key={fid}
                               facet={facetField}
                               ref={fid}
                               fieldSelections={this.props.selectedValues.getFieldSelections(fid)}
                               expanded={!this.props.isCollapsed(fid)}
                               handleToggleCollapse={this.props.handleToggleCollapse}
                               handleSelectValue={this.props.onFacetSelect}
                               handleClearFieldSelects={this.props.onFacetClearFieldSelects}
                {...this.props} />;
        });
    },

    /**
     * Renders the arrowed popover box with contents of the facet menu list of items
     * @returns {XML}
     */
    render() {
        let noFacetsMessage = "report.noFacets";
        return (
            <Popover id="facetsMenuPopup"
                     arrowOffsetLeft={28}
                     placement="bottom"
                     className="facetMenuPopup">
                {this.props.reportData && this.props.reportData.data &&
                this.props.reportData.data.facets && this.props.reportData.data.facets.list ?
                    this.facetsList(this.props.reportData.data.facets) :
                    <I18nMessage message={noFacetsMessage}/>}
            </Popover>
        );
    }
});

export default FacetsList;
