/**
* Initialize to nothing is selected (or the select is input from history/back)
* when a value is selected add its field to the selections hash if its not there
* add its value to the array if its not already in the array
*
* selections =
* {
*     fieldid1: ["selectedValueA" ,"selectedValueB"],
*     fieldid2: ["selectedValueC" ,"selectedValueD"],
*     fieldid3: ["selectedValueY" ,"selectedValueZ"],
*     fieldid4: [],
* }
 * // using array as fieldids used for keys are not always sequential as a array would serve
**/
import Logger from '../../utils/logger';
import _ from 'lodash';
let logger = new Logger();

class FacetSelections {
    constructor() {
        let emptyList = {};
        this.initSelections(emptyList);
    }

    copy() {
        let result = new FacetSelections();
        result.initSelections(this.selectionsHash);
        return result;
    }

    initSelections(newSet) {
        if (newSet && (typeof newSet === 'object')) {
            this.selectionsHash = _.cloneDeep(newSet);
        } else if (_.isUndefined(newSet)) {
            this.selectionsHash = {};
        }
        return this;
    }

    /**
     * Checks list of selection value to see any facet were selected
     *
     */
    hasAnySelections() {
        if (_.keys(this.selectionsHash).length === 0) {
            return false;
        } else {
            let foundAny =  _.some(this.selectionsHash, function(x) {
                return (x && (x.length > 0));
            });
            return foundAny;
        }
    }

    /**
     * Get list of fields with selections
     *
     */
    whichHasAnySelections() {
        let answer = [];
        if (_.keys(this.selectionsHash).length !== 0) {
            answer = _.all(this.selectionsHash, function(x) {
                return (x && (x.length > 0));
            });
        }
        return answer;
    }

    /**
     * Checks list of selection value to see if field is has any facet selections
     *
     * @param fieldId  - field to lookup
     */
    hasAnySelectionsForField(fieldId) {
        return (this.selectionsHash[fieldId] && this.selectionsHash[fieldId].length);
    }

    /**
     * Checks list of selection value to see if param is in the set
     *
     * @param fieldId  - field to lookup
     * @param value    - the value to check
     */
    isValueInSelections(fieldId, value) {
        if (this.selectionsHash[fieldId]) {
            // find the value,
            // todo// sort it first (in case there lots might be faster find)
            //return (_.indexOf(_.sortBy(this.selectionsHash[fieldId], value)) !== -1);
            return (_.indexOf(this.selectionsHash[fieldId], value) !== -1);
        } else {
            // nothing selected
            return false;
        }
    }

    /**
     * Gets list of facet selection values for a field
     *
     * @param fieldId  - field to retrieve selected values for
     */
    getFieldSelections(fieldId) {
        return (this.hasAnySelectionsForField(fieldId) ? this.selectionsHash[fieldId] : []);
    }


    /**
     * Gets list of facet selection values for all facets
     *
     */
    getSelections() {
        return (this.selectionsHash);
    }

    /**
     * Adds a value to a fields list of facet selections
     * mutates the array
     */
    addSelection(fieldId, value) {
        // if there is no array yet for the fieldId add one
        if (!this.selectionsHash[fieldId]) {
            this.selectionsHash[fieldId] = [value];
            // add the value to the array if its not there don't dup if its already there
        } else if (!this.isValueInSelections(fieldId, value)) {
            this.selectionsHash[fieldId].push(value);
        }
        return this.selectionsHash;
    }

    /**
     * removes a value from a fields list of facet selections
     * mutates the array
     */
    removeSelection(fieldId, value) {
        // if there is no array yet for the fieldId nothing to remove
        if (this.selectionsHash[fieldId]) {
            if (this.isValueInSelections(fieldId, value)) {
                _.pull(this.selectionsHash[fieldId], value);
            }
        } else {
            return null;
            // remove the value if its there
        }
        return this.selectionsHash;
    }

    /**
     * removes all values from a fields list of facet selections
     * mutates the array
     */
    removeAllFieldSelections(fieldId) {
        // if there is no array yet for the fieldId nothing to remove
        if (this.selectionsHash[fieldId]) {
            // remove the value if its there
            this.selectionsHash[fieldId] = [];
        } else {
            return null;
        }
        return this.selectionsHash;

    }

    /**
     * removes all values from a fields list of facet selections
     * mutates the array
     */
    removeAllSelections() {
        this.initSelections();
        return this.selectionsHash;

    }


    /**
     * Change state of a facet field value to selected if parameter select is true or not selected otherwise
     * by adding or removing the value ito the array of selected values for the field id
     *
     * @param facetField - the facet field
     * @param value - the value to effect
     * @param select - bool to select or deselect
     *
     **/
    setFacetValueSelectState(facetField, value, select) {
        if (select) {
            // add it to toggle to select state
            this.addSelection(facetField.id, value);
        } else {
            // remove to mark it deselected
            this.removeSelection(facetField.id, value);
        }
        // boolean only has either true or false set not both
        if (facetField.type === 'bool') {
            // if we just did a select and the selection for this field is both true & false
            // disable the other one that the newly selected
            if (select) {
                let other = (value === 'True') ? 'False' : 'True';
                this.removeSelection(facetField.id, other);
            }

        }
        ////caller to update the state
    }


    /**
     * function: toggleSelectFacetValue
     * Toggle the state of select of a facet field value in the popover
     * change state of a facet value from selected to non or vice versa
     *
     * @param facetField - the fact field you want to toggle
     * @param value  - the facet value for filter
     **/
    toggleSelectFacetValue(facetField, value) {
        this.setFacetValueSelectState(facetField, value, !this.isValueInSelections(facetField.id, value));
    }

}

export default FacetSelections;
