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
        return <IconActions {...this.props} actions={actions} onDropdownToggle={this.props.toggleRowActionsMenu(open)} />;
    }
});


const mapDispatchToProps = (dispatch) => {
    return {
        toggleRowActionsMenu: (toggleState) => dispatch(toggleRowActionsMenu(toggleState)),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(QbIconActions);


export {QbIconActions};
