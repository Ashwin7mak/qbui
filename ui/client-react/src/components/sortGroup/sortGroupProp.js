import React from 'react';

export const sortGroupFieldShape =
    React.PropTypes.shape({

        // true if descending, false if ascending
        descendOrder:React.PropTypes.bool,

        // only applicable for grouping the way groups are determined see
        // common/src/groupTypes.js
        howToGroup: React.PropTypes.string,

        // the field id
        id:React.PropTypes.number,

        //name of the field
        name: React.PropTypes.string,

        // sort or group
        type: React.PropTypes.string,

        // the string value describing the field sort/group option
        // i.e. "-5" sort field 5 desc "28:V" group field 28 by value ascending order
        unparsedVal: React.PropTypes.string

    });

export default sortGroupFieldShape;
