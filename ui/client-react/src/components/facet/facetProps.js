import React from 'react';

const facetItemValueShape = React.PropTypes.shape({
    value: React.PropTypes.string
});

const facetShape =  React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    type:React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(facetItemValueShape)
    /*TODO support date type of facet field  */
});

function validSelectionHashMap(props, propName, componentName, location, propFullName)  {
    let obj = props[propName];
    // Check if `obj` is an Array using `PropTypes.array`
    var isObjectError = React.PropTypes.array(props, propFullName, componentName, location);
    if (isObjectError) {
        return isObjectError;
    }
    return null;
}


const fieldSelections = React.PropTypes.shape({
    selectionsHash:validSelectionHashMap
});

export {facetItemValueShape, facetShape, fieldSelections};
