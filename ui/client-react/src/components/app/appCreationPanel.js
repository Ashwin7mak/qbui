import React from 'react';
import {PropTypes} from 'react';
import DialogFieldInput from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import Locale from '../../locales/locales';
import _ from 'lodash';

import './appCreationPanel.scss';
import '../table/dialogCreationPanel.scss';

class AppCreationPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * render the app settings UI
     * @returns {XML}
     */
    render() {

        return (
            <div className="appCreationPanel dialogCreationPanelInfo">
                <div className="sections">
                    <DialogFieldInput title={Locale.getMessage("appCreation.appNameHeading")}
                                      className="appCreationPanel"
                                      name="name"
                                      placeholder={Locale.getMessage("appCreation.appNamePlaceHolder")}
                                      required
                                      autofocus />
                </div>
            </div>);
    }
}

AppCreationPanel.propTypes = {
};

export default AppCreationPanel;
