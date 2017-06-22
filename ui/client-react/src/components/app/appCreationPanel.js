import React from 'react';
import {PropTypes} from 'react';
import DialogFieldInput from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {DIALOG_FIELD_INPUT_COMPONENT_TYPE} from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {connect} from 'react-redux';
import * as AppBuilderActions from '../../actions/appBuilderActions';
import * as AppBuilderSelectors from '../../reducers/appBuilder';
import Locale from '../../locales/locales';

import './appCreationPanel.scss';
import '../../../../reuse/client/src/components/multiStepDialog/dialogCreationPanel.scss';

export class AppCreationPanel extends React.Component {
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
                                      value={this.props.appName}
                                      onChange={this.props.setAppProperty}
                                      placeholder={Locale.getMessage("appCreation.appNamePlaceHolder")}
                                      required
                                      autofocus />

                    <DialogFieldInput title={Locale.getMessage("appCreation.descriptionHeading")}
                                      className="appCreationPanel"
                                      name="description"
                                      value={this.props.appDescription}
                                      onChange={ this.props.setAppProperty}
                                      component={DIALOG_FIELD_INPUT_COMPONENT_TYPE.textarea}
                                      rows="3" />
                </div>
            </div>);
    }
}


const mapStateToProps = (state) => {
    return {
        appName: AppBuilderSelectors.getAppProperty(state, 'name'),
        appDescription: AppBuilderSelectors.getAppProperty(state, 'description')
    };
};

const mapDispatchToProps = {
    setAppProperty: AppBuilderActions.setAppProperty
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppCreationPanel);
