import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import * as query from '../../constants/query';
import Header from '../header/smallHeader';
import {connect} from 'react-redux';
import * as ShellActions from '../../actions/shellActions';

/**
 * A header that takes the place of the top nav when viewing a record
 * (visible on small breakpoint currently)
 */
let RecordHeader = React.createClass({
    propTypes: {
        title: React.PropTypes.object
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        this.props.dispatch(ShellActions.toggleLeftNav());
    },

    render() {
        const headerClasses = "recordHeader";
        return <Header
            headerClasses={headerClasses}
            title={this.props.title}
        />;
    }
});

// export the react-redux connected wrapper (which injects the dispatch function as a prop)
export default connect()(RecordHeader);
