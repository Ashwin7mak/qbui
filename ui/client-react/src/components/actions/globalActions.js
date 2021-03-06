import React from 'react';
import DefaultTopNavGlobalActions from '../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import {changeLocale} from '../../actions/shellActions';
import {connect} from 'react-redux';

export const GlobalActions = React.createClass({

    changeLocale: function(locale) {
        this.props.changeLocale(locale);
    },

    render() {
        return <DefaultTopNavGlobalActions
            {...this.props}
            changeLocale={this.changeLocale}
            shouldOpenMenusUp={this.props.position === 'left'}
        />;
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        changeLocale: (locale) => dispatch(changeLocale(locale))
    };
};

export default connect(null, mapDispatchToProps)(GlobalActions);
