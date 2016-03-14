import React from 'react';
import ReactDOM from 'react-dom';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';

import  {fieldSelections, facetsProp} from './facetProps';

import FacetsItem from './facetsItem';
import QBicon from '../qbIcon/qbIcon';
import simpleStringify from '../../../../common/src/simpleStringify';
import * as schemaConsts from '../../constants/schema.js';

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
    propTypes: {
        reportData: React.PropTypes.shape({
            data: React.PropTypes.shape({
                facets:  facetsProp
            })
        }),
        selectedValues: fieldSelections
    },

    getDefaultProps() {
        return {
            isCollapsed() {return false;}
        };
    },

    shouldComponentUpdate(nextProps, nextState) {

        let answer = false;

        if (this.props.selectedValues &&
            (!_.isEqual(nextProps.selectedValues.getSelections(), this.props.selectedValues.getSelections()))) {
            answer = true;
        }

        if (!_.isEqual(nextProps.expandedFacetFields, this.props.expandedFacetFields)) {
            answer = true;
        }

        if (!_.isEqual(nextProps.moreRevealedFacetFields, this.props.moreRevealedFacetFields)) {
            answer = true;
        }

        return answer;
    },

    facetsList(facetsData) {

        //values are expected to be objects {value:'xx'},
        // make it so until node layer is changed
        let YesMsg = 'report.facets.yesCheck';
        let NoMsg = 'report.facets.noCheck';

        if (facetsData.length && facetsData[0].values && facetsData[0].values.length && typeof facetsData[0].values[0] !== 'object') {
            facetsData = facetsData.map((aFacet) => {
                aFacet.values = aFacet.values.map((val) => {
                    if (aFacet.type.toUpperCase() === schemaConsts.CHECKBOX) {
                        if (!val || val === "" || val === 0 ||
                            val.toString().toUpperCase() === 'NO' ||
                            val.toString().toUpperCase() === 'FALSE') {
                            // when react 18n supports plain string (non dom wrapped)
                            // xtlate use the message keys above
                            val = 'No';
                        } else {
                            val = 'Yes';
                        }
                    }
                    return {value: val};
                });
                return aFacet;
            });
        }
        // filter out the date fields for now
        // TODO: support date ranges in filtering see https://jira.intuit.com/browse/QBSE-20422
        if (facetsData.length && facetsData[0].values) {
            facetsData.filter((facetField) => !(facetField.type.toUpperCase().includes(schemaConsts.DATE)));
        }
        // create field facet sections
        return facetsData.map((facetField) => {
            var fid = facetField.id;
            var inputProps = {
                eventKey: facetField,
                key: "FacetsItem." + this.props.popoverId + "." + fid,
                ref: fid,
                facet: facetField,
                popoverId : this.props.popoverId,
                maxInitRevealed : this.props.maxInitRevealed,
                isRevealed :!_.isUndefined(this.props.isRevealed) && this.props.isRevealed(fid),
                expanded: !_.isUndefined(this.props.isCollapsed) && !this.props.isCollapsed(fid),
                handleSelectValue: this.props.onFacetSelect,
                handleToggleCollapse: this.props.handleToggleCollapse,
                handleClearFieldSelects: this.props.onFacetClearFieldSelects,
                handleRevealMore: this.props.handleRevealMore
            };

            if (this.props.selectedValues && this.props.selectedValues.getFieldSelections) {
                inputProps.fieldSelections = this.props.selectedValues.getFieldSelections(fid);
            }

            return <FacetsItem  {...inputProps} />;
        });
    },

    /**
     * Renders the arrowed popover box with contents of the facet menu list of items
     * @returns {XML}
     */
    render() {
        let noFacetsMessage = "report.facets.noFacets";
        //TODO get xd specific for handle no facet info returned from server see https://jira.intuit.com/browse/QBSE-19865
        return (
            <Popover id={this.props.popoverId}
                     arrowOffsetLeft={28}
                     placement="bottom"
                     className="facetMenuPopup"
                     ref={(thisComponent) => this._facetMenuArea = thisComponent}>
                    {this.props.reportData && this.props.reportData.data  &&
                    this.props.reportData.data.facets && (this.props.reportData.data.facets.length > 0)
                    && this.props.reportData.data.facets[0].values ?
                        this.facetsList(this.props.reportData.data.facets) :
                        <div className="noFacetValues">
                            <I18nMessage message={noFacetsMessage}/>
                        </div>}
            </Popover>
        );
    }
});

export default FacetsList;
