import React from 'react';
import IconActions from '../../../../reuse/client/src/components/iconActions/iconActions';
import {connect} from 'react-redux';
import {toggleRowActionsMenu} from '../../actions/shellActions';

/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 *
 * The remaining code here is for backwards compatability until Fluxxor is completely removed.
 * If you are building a new IconActions set, please use IconActions from the reuse library.
 **/
const QbIconActions = React.createClass({
    onDropDownToggle(open) {
        // This adds white space at the bottom when the row menu is open to avoid clipping row menu pop up.
        // It will remove the white space if the menu is closed. The class is added in reportContent.js
        this.props.toggleRowActionsMenu(open);
    },

    render() {
        // Some of the props have been made more descriptive and to bring it in line with other components (e.g., Tooltip).
        // This function maps to the new property names for each action.
        let actions = this.props.actions.map(action => {
            if (action.rawMsg) {
                action.plainMessage = action.msg;
            } else {
                action.i18nMessageKey = action.msg;
            }

            return action;
        });

        return <IconActions {...this.props} actions={actions} onDropdownToggle={this.onDropDownToggle} />;
    }
});


const mapDispatchToProps = (dispatch) => {
    return {toggleRowActionsMenu};
};

export default connect(
    null,
    mapDispatchToProps
)(QbIconActions);


export {QbIconActions};
