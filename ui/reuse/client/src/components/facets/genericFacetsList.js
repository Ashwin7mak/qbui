import React, {Component, PropTypes} from 'react';
import Popover from 'react-bootstrap/lib/Popover';
import {I18nMessage} from '../../utils/i18nMessage';
import GenericFacetItem from './genericFacetItem';
import './facet.scss';

// IMPORTS FROM CLIENT REACT
import thwartClicksWrapper from '../../../../../client-react/src/components/hoc/thwartClicksWrapper';
import closeOnEscape from '../../../../../client-react/src/components/hoc/catchEscapeKey';
// IMPORTS FROM CLIENT REACT

/**
 * NOTE: Most likely, you want to use the `GenericFacetMenu`. Check out that component first before using this one.
 *
 * FacetsList component presents a list of facets available to filter the report on;
 * For each facet field in the list it will make a FacetsItem component
 **/
class GenericFacetsList extends Component {
    /**
     * Renders each field inf the list of facet fields with FacetItem component
     *
     * @param facetsData - the list of facet field object
     * @returns the prepared set of FacetsItem components for rendering
     */

    /**
     *  Checks whether the facetsMenu renders facets
     */
    isExpanded = (fid) => this.props.expandedFacets && (this.props.expandedFacets.indexOf(fid) >= 0);

    /**
     *  Checks whether there are any facets to be rendered
     */
    hasFacets = () => this.props.facets && this.props.facets.length;

    /**
     *  Renders the facets list containing the facets and passes required props to GenericFacetItem for callback
     */
    facetsList = () => {
        let facetsData = this.props.facets;
        // create field facet sections
        return facetsData.map((facetField) => {
            let fid = facetField.id;
            let inputProps = {
                key: "FacetsItem." + this.props.popoverId + "." + fid,
                facet: facetField,
                popoverId : this.props.popoverId,
                isExpanded: this.isExpanded(fid),
                onClickFacet: this.props.onClickFacet,
                onClickFacetValue: this.props.onClickFacetValue,
                onClickClearFacetValues: this.props.onClickClearFacetValues,
                onClickShowMore: this.props.onClickShowMore,
            };

            if (this.props.selectedFacetValues && this.props.selectedFacetValues[fid]) {
                inputProps.selectedFacetValues = this.props.selectedFacetValues[fid];
            }

            return <GenericFacetItem  {...inputProps} />;
        });
    }

    /**
     * Renders the arrowed popover box with contents of the facet menu list of items
     * @returns {XML}
     */
    render() {
        let noFacetsMessage = "report.facets.noFacets";
        class FacetPopover extends Component {
            render() {
                return <Popover {...this.props} />;
            }
        }
        let PopoverWrapped = closeOnEscape(thwartClicksWrapper(FacetPopover));

        //TODO get xd specific for handle no facet info returned from server see https://jira.intuit.com/browse/QBSE-19865
        return (
            <PopoverWrapped id={this.props.popoverId}
                            handleClickOutside={this.props.onMenuHide}
                            onClose={this.props.onMenuHide}
                            outsideClickIgnoreClass="facetsMenuContainer"
                            arrowOffsetLeft={28}
                            placement="bottom"
                            className="facetMenuPopup"
                            ref="facetMenuPopup"
                            showMenu={this.props.onMenuShow}
            >
                {this.hasFacets() ?
                    this.facetsList() :
                    <div className="noFacetValues">
                        <I18nMessage message={noFacetsMessage}/>
                    </div>}
            </PopoverWrapped>
        );
    }
}

GenericFacetsList.propTypes = {
    /**
     *  A unique identifier for this particular menu.
     */
    popoverId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     *  Hides the facets menu when clicked
     */
    onMenuHide: PropTypes.func,

    /**
     *  Shows the facets menu when clicked
     */
    onMenuShow: PropTypes.func,

    /**
     * The data which is being passed to be filtered
     */
    facets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        values: PropTypes.array,
        hasMore: PropTypes.bool,
    })),

    /**
     *  Object which contains the selected facets
     */
    selectedFacetValues: PropTypes.object,
};

export default GenericFacetsList;
