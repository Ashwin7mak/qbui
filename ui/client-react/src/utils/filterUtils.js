/**
 * Static class of Filter Utility functions
 */
import * as schemaConsts from '../constants/schema.js';

class FilterUtils {

    static getFilter(searchFor, selected, facetFields) {
        //var facetExpression = [{fid:'3', values:['10', '11']}, {fid:'4', values:['abc']}];
        let facetExpression = [];
        let fields = selected.whichHasAnySelections();

        //skip sending the dummy date to the server for query
        facetExpression = fields.filter((field)  => !facetFields[field].mockFilter || facetFields[field].mockFilter === false)
                                .map((field) => {
                                    let values = selected.getFieldSelections(field);
                                    // use 1 or 0 for searching bool field types not the text
                                    if (facetFields[field].type === schemaConsts.CHECKBOX) {
                                        var boolVal = values[0] === "Yes" ? 1 : 0;
                                        values = [boolVal];
                                    }
                                    return {fid: field, values: values};
                                });
        return {
            selections: selected,
            facet: facetExpression,
            search: searchFor
        };
    }
}

export default FilterUtils;
