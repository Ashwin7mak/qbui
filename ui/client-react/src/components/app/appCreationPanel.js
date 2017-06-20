import React from 'react';
import {PropTypes} from 'react';
import DialogFieldInput from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {DIALOG_FIELD_INPUT_COMPONENT_TYPE} from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import Locale from '../../locales/locales';
import _ from 'lodash';

import './appCreationPanel.scss';
import '../../../../reuse/client/src/components/multiStepDialog/dialogCreationPanel.scss';

class AppCreationPanel extends React.Component {
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

                    <DialogFieldInput title={Locale.getMessage("appCreation.descriptionHeading")}
                                      className="appCreationPanel"
                                      name="description"
                                      component={DIALOG_FIELD_INPUT_COMPONENT_TYPE.textarea}
                                      rows="3"/>
                </div>
            </div>);
    }
}

export default AppCreationPanel;
