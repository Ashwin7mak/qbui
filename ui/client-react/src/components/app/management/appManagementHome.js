/**
 * Created by rbeyer on 2/3/17.
 */
import React, {PropTypes} from 'react';
import SettingsMenuItem from './settingsMenuItem';

const AppManagementHome = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        appUsers: PropTypes.array.isRequired
    },

    render() {
        return (
            <div>
                <SettingsMenuItem appId={this.props.appId}
                                  title="Hey this is the title"
                                  subTitle="the coolest subtitle ever!"
                                  icon="check"
                />
            </div>
        );
    }

});

export default AppManagementHome;