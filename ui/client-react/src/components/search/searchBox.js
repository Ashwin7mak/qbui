/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 **/

import React, {PropTypes} from 'react';
import IconInputBox from '../../../../reuse/client/src/components/iconInputBox/iconInputBox';

/**
 * A search box built from the reusable IconInputBox
 */
const SearchBox = React.createClass({
    propTypes: {
        className: PropTypes.string,
        searchBoxKey: PropTypes.string,
        placeholder: PropTypes.string,
        hideClearIcon: PropTypes.bool, //if the box chooses to not render clear icon
        onChange: PropTypes.func,
        onClearSearch: PropTypes.func,
        value: PropTypes.string
    },
    render: function() {
        return (
            <IconInputBox onClear={this.props.onClearSearch} {...this.props} />
        );
    }
});

export default SearchBox;
