import React from 'react';
import DefaultTopNavGlobalActions from '../../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import {changeLocale} from '../../actions/shellActions';
import {connect} from 'react-redux';

const GlobalActions = React.createClass({

    changeLocale: function(locale) {
        this.props.dispatch(changeLocale(locale));
    },

    render() {
        return <DefaultTopNavGlobalActions
            {...this.props}
            changeLocale={this.changeLocale}
            shouldOpenMenusUp={this.props.position === 'left'}
        />;
    }
});

export default connect()(GlobalActions);
