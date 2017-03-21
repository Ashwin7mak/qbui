import React from 'react';
import Fluxxor from 'fluxxor';
import ReIconActions from '../../../../reuse/client/src/components/iconActions/iconActions';
const FluxMixin = Fluxxor.FluxMixin(React);

let IconActions = React.createClass({
    mixins: [FluxMixin],

    onDropdownToggle(open) {
        //This adds white space at the bottom when the row menu is open to avoid clipping row menu pop up.
        //It will remove the white space if the menu is close. The class is added in reportContent.js
        //TODO: Convert to ShellAction (toggleRowActionsMenu) when reactabular work is done. It breaks with ag-grid.
        this.getFlux().actions.onToggleRowPopUpMenu(open);
    },

    render() {
        return <ReIconActions {...this.props} onDropdownToggle={this.onDropdownToggle} />;
    }
});

export default IconActions;
