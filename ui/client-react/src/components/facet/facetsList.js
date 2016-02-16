import React from 'react';
import ReactDOM from 'react-dom';
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
     * Add an event listener for document clicks, so when the click occurs outside the facet menu
     * it closes the menu, this makes it easy to use for small displays not requiring the button
     * be clicked again to close it.
     */
    componentDidMount() {
        window.__app_container = document.getElementById('content');
        window.__app_container.addEventListener('click', this.handleDocumentClick);
    },

    /**
     * Stop the listener created on mount
     */
    componentWillUnmount() {
        window.__app_container.removeEventListener('click', this.handleDocumentClick);
    },

    /**
     * Close the menu if user clicks outside of the popover and menu button areas
     * @param evt
     */
    handleDocumentClick(evt) {
        const area = ReactDOM.findDOMNode(this._facetMenuArea);
        const button = this.props.menuButton;

        if (!area.contains(evt.target) && !button.contains(evt.target)) {
            this.props.onClickOutside(evt);
        }
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
