import React from 'react';
import ReactDOM from 'react-dom';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import Logger from '../../utils/logger';
import {I18nMessage} from '../../utils/i18nMessage';
import StringUtils from '../../utils/stringUtils';

import  {fieldSelections} from './facetProps';

import FacetsItem from './facetsItem';
import QBicon from '../qbIcon/qbIcon';
import simpleStringify from '../../../../common/src/simpleStringify';

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
                facets:  React.PropTypes.shape({
                    list: React.PropTypes.array.isRequired
                })
            })
        }),
        selectedValues: fieldSelections
    },

    getDefaultProps() {
        return {
            isCollapsed : function() {return false;}
        };
    },


    shouldComponentUpdate: function(nextProps, nextState) {

        let answer = false;

        if (this.props.selectedValues &&
            (!_.isEqual(nextProps.selectedValues.getSelections(), this.props.selectedValues.getSelections()))) {
            answer = true;
            logger.debug('selection changed');
        }

        if (!_.isEqual(nextProps.expandedFacetFields, this.props.expandedFacetFields)) {
            answer = true;
            logger.debug('collapse changed');
        }

        if (!_.isEqual(nextProps.moreRevealedFacetFields, this.props.moreRevealedFacetFields)) {
            answer = true;
            logger.debug('reveal changed');
        }

        if (answer) {
            logger.debug('FacetList shouldComponentUpdate \ncurrProps:' + simpleStringify(this.props) + ' \nnextProps:' + simpleStringify(nextProps));
            logger.debug('currState:' + simpleStringify(this.state) + ' \nnextState:' + simpleStringify(nextState));
        }


        return answer;
    },

    facetsList(facetsData) {
        return facetsData.list.map((facetField) => {
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
        let noFacetsMessage = "report.noFacets";
        return (
            <Popover id={this.props.popoverId}
                     arrowOffsetLeft={28}
                     placement="bottom"
                     className="facetMenuPopup"
                     ref={(thisComponent) => this._facetMenuArea = thisComponent}>
                    {this.props.reportData && this.props.reportData.data &&
                    this.props.reportData.data.facets && this.props.reportData.data.facets.list ?
                        this.facetsList(this.props.reportData.data.facets) :
                        <I18nMessage message={noFacetsMessage}/>}
            </Popover>
        );
    }
});

export default FacetsList;
