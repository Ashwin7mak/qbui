import React from 'react';
import Fluxxor from 'fluxxor';
import IconActions from '../../../../reuse/client/src/components/iconActions/iconActions';
const FluxMixin = Fluxxor.FluxMixin(React);

/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 *
 * The remaining code here is for backwards compatability until Fluxxor is completely removed.
 * If you are building a new IconActions set, please use IconActions from the reuse library.
 **/
const QbIconActions = React.createClass({
    mixins: [FluxMixin],

    onDropDownToggle(open) {
        //This adds white space at the bottom when the row menu is open to avoid clipping row menu pop up.
        //It will remove the white space if the menu is close. The class is added in reportContent.js
        //TODO: Convert to ShellAction (toggleRowActionsMenu) when reactabular work is done. It breaks with ag-grid.
        this.getFlux().actions.onToggleRowPopUpMenu(open);
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

export default QbIconActions;
