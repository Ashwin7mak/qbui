import React from 'react';

const chainablePropType = predicate => {
    const propType = (props, propName, componentName) => {
        // don't do any validation if empty
        if (props[propName] === null) {
            return;
        }

        return predicate(props, propName, componentName);
    };

    propType.isRequired = (props, propName, componentName) => {
        // warn if empty
        if (props[propName] === null) {
            return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
        }

        return predicate(props, propName, componentName);
    };

    return propType;
};

const facetItemValueShape = chainablePropType(() => {
    React.PropTypes.shape({
        value: React.PropTypes.string
    });
});


const facetShape = chainablePropType(() => {
    React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        type:React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        values: React.PropTypes.arrayOf(facetItemValueShape)
        /*TODO support date type of facet field  */
    });
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


const fieldSelections = chainablePropType(() => {
    React.PropTypes.shape({
        selectionsHash: validSelectionHashMap
    });
});

// this check maybe too slow, just validate it's an object
//const facetsProp = chainablePropType(() => {
    //React.PropTypes.shape({
    //    list: React.PropTypes.array
//});
const facetsProp =  React.PropTypes.array;


export {facetItemValueShape, facetShape, fieldSelections, facetsProp, validSelectionHashMap};
