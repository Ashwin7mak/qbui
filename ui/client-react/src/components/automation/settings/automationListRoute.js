import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import Loader from 'react-loader';
import {NotificationManager} from 'react-notifications';
import Locale from '../../../locales/locales';
import Stage from '../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../../../reuse/client/src/components/iconActions/iconActions';
import {I18nMessage} from '../../../utils/i18nMessage';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../../reuse/client/src/components/icon/icon.js';
import QBModal from '../../qbModal/qbModal';
// import {openIconChooser, closeIconChooser, setEditingProperty} from '../../../actions/tablePropertiesActions';
import _ from 'lodash';

import './automationList.scss';



export const AutomationListRoute = React.createClass({

    getInitialState() {
        return {
            confirmInputValue: ""
        };
    },
    getExistingAutomationNames() {
        return [];
    },
    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },
    getStageHeadline() {
        return <div className="automationListSettingsStage stageHeadLine"><I18nMessage message={"settings.automationSettings"}/></div>;
    },
    componentDidMount() {
    },
    componentWillReceiveProps(nextProps) {
    },
    render() {
        return <div>
                <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}></Stage>

                <div className="automationListMessage">
                    Welcome to your automations for this App. This page is under construction. More will be available very soon.
                </div>
            </div>;
    }
});

const mapStateToProps = (state) => {
    return {
        isDirty: false
    };
};

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutomationListRoute);
